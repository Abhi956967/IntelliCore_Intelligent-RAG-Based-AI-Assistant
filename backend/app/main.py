from dotenv import load_dotenv
import os
import sys
from pathlib import Path
import certifi

# Ensure backend root is in sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

# Load .env from backend/.env or root .env
backend_env = backend_root / ".env"
root_env = backend_root.parent / ".env"
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env)
elif root_env.exists():
    load_dotenv(dotenv_path=root_env)
else:
    load_dotenv()

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

import json
import re
import uuid

import uvicorn
from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.messages import (
    HumanMessage,
    AIMessage,
    AIMessageChunk,
    SystemMessage,
    ToolMessage
)

from app.agents.chatbot_agent import get_agent
from app.database.operations import (
    init_db,
    save_chat_message,
    get_chat_history,
    create_or_update_conversation,
    delete_all_conversations,
    delete_conversation,
    get_conversation,
    list_conversations,
    search_conversations,
    update_conversation,
    save_uploaded_file,
    list_uploaded_files,
    delete_uploaded_file
)

from app.rag.service import add_document_to_rag, delete_document_from_rag
from app.tools.agent_tools import set_current_thread_id
from app.portfolio.knowledge import portfolio_profile


app = FastAPI(title="IntelliCore API", description="Intelligent RAG-Based AI Assistant")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates_dir = Path(__file__).resolve().parent / "templates"
templates = Jinja2Templates(directory=str(templates_dir))

from app.storage import get_uploads_dir

UPLOADS_DIR = get_uploads_dir()

init_db()

MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(15 * 1024 * 1024)))

def get_frontend_dist_dir() -> Path | None:
    candidates = [
        backend_root.parent / "frontend" / "dist",
        backend_root.parent / "frontend_dist",
        Path("frontend/dist"),
        Path("frontend_dist")
    ]
    for candidate in candidates:
        if candidate.exists() and (candidate / "index.html").exists():
            return candidate
    return None


# Serve React frontend from the built dist folder if it exists
frontend_dist_dir = get_frontend_dist_dir()
if frontend_dist_dir is not None:
    assets_dir = frontend_dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")


def conversation_payload(item):
    return {
        "conversation_id": item.thread_id,
        "thread_id": item.thread_id,
        "title": item.title,
        "pinned": bool(getattr(item, "pinned", False)),
        "created_at": item.created_at.isoformat(),
        "updated_at": item.updated_at.isoformat()
    }


def message_payload(msg):
    sources = []
    if getattr(msg, "sources_json", None):
        try:
            sources = json.loads(msg.sources_json)
        except Exception:
            pass
    return {
        "message_id": str(msg.id),
        "conversation_id": msg.thread_id,
        "thread_id": msg.thread_id,
        "role": msg.role,
        "content": msg.content,
        "timestamp": msg.created_at.isoformat(),
        "sources": sources,
        "attachments": [],
        "metadata": {}
    }


def safe_upload_filename(filename: str) -> str:
    name = Path(filename or "uploaded_file").name
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._")
    return name or "uploaded_file"


@app.get("/health")
async def health_check():
    """Health check endpoint for deployment"""
    return {"status": "ok", "service": "IntelliCore AI Assistant"}


@app.get("/")
async def home(request: Request):
    """Serve React app if available, otherwise fallback to Jinja2 template"""
    frontend_dist_dir = get_frontend_dist_dir()
    if frontend_dist_dir is not None:
        return FileResponse(str(frontend_dist_dir / "index.html"))
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )



@app.get("/conversations")
async def conversations():
    items = list_conversations()

    return {
        "conversations": [
            conversation_payload(item)
            for item in items
        ]
    }



@app.get("/history/{thread_id}")
async def history(thread_id: str):
    messages = get_chat_history(thread_id)

    return {
        "messages": [
            message_payload(msg)
            for msg in messages
        ]
    }


@app.post("/api/conversations")
async def create_conversation(request: Request):
    try:
        data = await request.json()
    except Exception:
        data = {}

    conversation_id = data.get("conversation_id") or data.get("thread_id") or str(uuid.uuid4())
    title = data.get("title") or "New Chat"
    item = create_or_update_conversation(conversation_id, title)

    if title != "New Chat":
        item = update_conversation(conversation_id, title=title) or item

    return conversation_payload(item)


@app.get("/api/conversations")
async def api_conversations(request: Request):
    query = request.query_params.get("q", "").strip()
    items = search_conversations(query) if query else list_conversations()

    return {
        "conversations": [
            conversation_payload(item)
            for item in items
        ]
    }


@app.delete("/api/conversations")
async def api_delete_all_conversations():
    delete_all_conversations()
    return {"success": True}


@app.get("/api/conversations/{conversation_id}")
async def api_conversation(conversation_id: str):
    item = get_conversation(conversation_id)

    if not item:
        return JSONResponse({"error": "Conversation not found."}, status_code=404)

    return {
        **conversation_payload(item),
        "messages": [
            message_payload(msg)
            for msg in get_chat_history(conversation_id)
        ]
    }


@app.patch("/api/conversations/{conversation_id}")
async def api_update_conversation(conversation_id: str, request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse({"error": "Invalid JSON body."}, status_code=400)

    item = update_conversation(
        conversation_id,
        title=data.get("title"),
        pinned=data.get("pinned") if "pinned" in data else None
    )

    if not item:
        return JSONResponse({"error": "Conversation not found."}, status_code=404)

    return conversation_payload(item)


@app.delete("/api/conversations/{conversation_id}")
async def api_delete_conversation(conversation_id: str):
    deleted = delete_conversation(conversation_id)

    if not deleted:
        return JSONResponse({"error": "Conversation not found."}, status_code=404)

    return {"success": True}


@app.get("/api/conversations/{conversation_id}/messages")
async def api_conversation_messages(conversation_id: str):
    if not get_conversation(conversation_id):
        return JSONResponse({"error": "Conversation not found."}, status_code=404)

    return {
        "messages": [
            message_payload(msg)
            for msg in get_chat_history(conversation_id)
        ]
    }


@app.post("/api/conversations/{conversation_id}/messages")
async def api_create_message(conversation_id: str, request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse({"error": "Invalid JSON body."}, status_code=400)

    role = data.get("role")
    content = data.get("content", "")

    if role not in {"user", "assistant", "system"}:
        return JSONResponse({"error": "Role must be user, assistant, or system."}, status_code=400)

    if not content.strip():
        return JSONResponse({"error": "Content is required."}, status_code=400)

    create_or_update_conversation(conversation_id, content)
    save_chat_message(conversation_id, role, content)

    messages = get_chat_history(conversation_id)
    return message_payload(messages[-1])


@app.get("/api/portfolio")
async def api_portfolio():
    return portfolio_profile()




@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    thread_id: str = Form(...)
):
    try:
        allowed_extensions = [".pdf", ".docx", ".txt", ".md", ".py", ".csv"]

        filename = safe_upload_filename(file.filename or "uploaded_file")
        suffix = Path(filename).suffix.lower()

        if suffix not in allowed_extensions:
            return JSONResponse(
                {
                    "success": False,
                    "message": "Unsupported file type. Upload PDF, DOCX, TXT, MD, PY, or CSV."
                },
                status_code=400
            )

        contents = await file.read()

        if len(contents) > MAX_UPLOAD_BYTES:
            return JSONResponse(
                {
                    "success": False,
                    "message": f"File is too large. Maximum upload size is {MAX_UPLOAD_BYTES // (1024 * 1024)} MB."
                },
                status_code=413
            )

        file_id = str(uuid.uuid4())
        file_path = UPLOADS_DIR / f"{file_id}_{filename}"

        with open(file_path, "wb") as f:
            f.write(contents)

        create_or_update_conversation(thread_id, "Uploaded document")

        result = add_document_to_rag(
            file_path=str(file_path),
            thread_id=thread_id
        )

        # Save uploaded file in database
        save_uploaded_file(
            thread_id=thread_id,
            file_id=file_id,
            filename=filename,
            file_path=str(file_path),
            chunks_count=result["chunks"]
        )

        return JSONResponse({
            "success": True,
            "message": f"Uploaded {result['filename']} and created {result['chunks']} chunks.",
            "file_id": file_id
        })

    except Exception as e:
        return JSONResponse(
            {
                "success": False,
                "message": str(e)
            },
            status_code=500
        )


@app.get("/api/conversations/{conversation_id}/files")
async def get_conversation_files(conversation_id: str):
    """Retrieve list of files uploaded to a specific conversation"""
    try:
        files = list_uploaded_files(conversation_id)
        return {
            "files": [
                {
                    "file_id": f.file_id,
                    "filename": f.filename,
                    "chunks_count": f.chunks_count,
                    "created_at": f.created_at.isoformat()
                }
                for f in files
            ]
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@app.delete("/api/conversations/{conversation_id}/files/{file_id}")
async def delete_conversation_file(conversation_id: str, file_id: str):
    """Delete a specific file from ChromaDB, local uploads directory, and database"""
    try:
        file_rec = delete_uploaded_file(conversation_id, file_id)
        if not file_rec:
            return JSONResponse({"error": "File record not found"}, status_code=404)

        # Delete file from local file system
        try:
            p = Path(file_rec.file_path)
            if p.exists():
                p.unlink()
        except Exception:
            pass

        # Delete document from RAG vectorstore
        try:
            delete_document_from_rag(filename=file_rec.filename, thread_id=conversation_id)
        except Exception:
            pass

        return {"success": True, "message": f"Successfully deleted {file_rec.filename}"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)



def sse_data(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def should_stream_chunk(chunk, metadata) -> bool:
    """
    This prevents raw tool/search/RAG JSON from appearing in the frontend.

    We only stream normal AI text chunks.
    We do NOT stream:
    - ToolMessage
    - messages from tool nodes
    - tool call chunks
    - raw tool outputs
    """

    metadata = metadata or {}

    node_name = str(metadata.get("langgraph_node", "")).lower()

    if "tool" in node_name:
        return False

    if isinstance(chunk, ToolMessage):
        return False

    if not isinstance(chunk, (AIMessage, AIMessageChunk)):
        return False

    if getattr(chunk, "tool_calls", None):
        return False

    if getattr(chunk, "invalid_tool_calls", None):
        return False

    additional_kwargs = getattr(chunk, "additional_kwargs", {}) or {}

    if additional_kwargs.get("tool_calls"):
        return False

    return True


def extract_text_from_chunk(chunk) -> str:
    content = getattr(chunk, "content", "")

    if not content:
        return ""

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        text_parts = []

        for item in content:
            if isinstance(item, str):
                text_parts.append(item)

            elif isinstance(item, dict):
                if item.get("type") == "text" and isinstance(item.get("text"), str):
                    text_parts.append(item["text"])
                elif isinstance(item.get("text"), str):
                    text_parts.append(item["text"])
                elif isinstance(item.get("content"), str):
                    text_parts.append(item["content"])

        return "".join(text_parts)

    return ""


def format_chat_error(error: Exception) -> str:
    message = str(error)

    # If it is explicitly an invalid API key issue, let the developer know.
    if "API_KEY_INVALID" in message or "API key not valid" in message:
        return "The Gemini API key is invalid. Please update GOOGLE_API_KEY in your .env file."

    if "invalid_api_key" in message or "Invalid API Key" in message:
        return "The Groq API key is invalid. Please update GROQ_API_KEY in your .env file."

    # Otherwise, return the friendly message for any other failures (quota, rate limit, server error, timeout, network failure, etc.).
    return "Both AI providers are temporarily unavailable. Please try again in a few moments."


def recent_context_message(thread_id: str, limit: int = 10) -> SystemMessage | None:
    history = get_chat_history(thread_id)
    recent = [
        msg
        for msg in history
        if msg.role in {"user", "assistant"}
    ][-limit:]

    if not recent:
        return None

    transcript = "\n".join(
        f"{msg.role}: {msg.content[:1200]}"
        for msg in recent
    )

    return SystemMessage(
        content=(
            "Recent persisted conversation context from SQLite. "
            "Use this only as background continuity; prioritize the latest user message.\n\n"
            f"{transcript}"
        )
    )



@app.post("/chat/stream")
@app.post("/api/chat/stream")
async def chat_stream(request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(
            {"error": "Invalid JSON body."},
            status_code=400
        )

    user_message = data.get("message", "")
    thread_id = data.get("conversation_id") or data.get("thread_id") or str(uuid.uuid4())
    selected_model = data.get("model")

    if not user_message.strip():
        return JSONResponse(
            {"error": "Message is required."},
            status_code=400
        )

    agent = get_agent(selected_model)

    persisted_context = recent_context_message(thread_id)

    create_or_update_conversation(thread_id, user_message)
    save_chat_message(thread_id, "user", user_message)

    set_current_thread_id(thread_id)

    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    def event_generator():
        final_answer = ""
        from app.storage import current_sources
        current_sources.set([])

        try:
            input_messages = []

            if persisted_context:
                input_messages.append(persisted_context)

            input_messages.append(HumanMessage(content=user_message))

            inputs = {
                "messages": input_messages
            }

            sent_statuses = set()

            for chunk, metadata in agent.stream(
                inputs,
                config=config,
                stream_mode="messages"
            ):
                # Check for tool execution status
                tool_calls = getattr(chunk, "tool_calls", None)
                if not tool_calls and hasattr(chunk, "additional_kwargs"):
                    tool_calls = chunk.additional_kwargs.get("tool_calls")

                if tool_calls:
                    for tc in tool_calls:
                        tool_name = tc.get("name") if isinstance(tc, dict) else getattr(tc, "name", None)
                        if tool_name and tool_name not in sent_statuses:
                            sent_statuses.add(tool_name)
                            status_msg = f"Running {tool_name.replace('_', ' ')}..."
                            if tool_name == "tavily_search":
                                status_msg = "Searching the web..."
                            elif tool_name == "search_uploaded_documents":
                                status_msg = "Reading uploaded documents..."
                            elif tool_name == "search_portfolio":
                                status_msg = "Searching Abhishek's portfolio..."
                            elif tool_name == "calculator":
                                status_msg = "Computing math calculation..."
                            yield sse_data({"status": status_msg})

                if not should_stream_chunk(chunk, metadata):
                    continue

                token = extract_text_from_chunk(chunk)

                if token:
                    final_answer += token
                    yield sse_data({"token": token})

            # Stream collected citations / sources if any
            sources = current_sources.get()
            if sources:
                yield sse_data({"sources": sources})

            if final_answer.strip():
                sources_str = json.dumps(sources) if sources else None
                save_chat_message(thread_id, "assistant", final_answer, sources_str)

            yield sse_data({"done": True})

        except Exception as e:
            yield sse_data({"error": format_chat_error(e)})
            yield sse_data({"done": True})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )





if __name__ == "__main__":
   
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8080,
        reload=True
    )
