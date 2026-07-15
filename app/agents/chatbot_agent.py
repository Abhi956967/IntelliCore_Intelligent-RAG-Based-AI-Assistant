import os
import sqlite3
from pathlib import Path

from dotenv import load_dotenv
import certifi

load_dotenv()

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, START, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.sqlite import SqliteSaver
from app.tools.agent_tools import tools

from app.storage import get_data_dir

DATA_DIR = get_data_dir()


GEMINI_MODELS = {
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-pro",
    "gemini-2.0-pro-exp-02-05",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
}

GROQ_MODELS = {
    "llama-3.1-8b-instant",
    "llama-3.1-8b-instruct",
}

ALLOWED_MODELS = GEMINI_MODELS | GROQ_MODELS

FALLBACK_GEMINI_MODEL = "gemini-2.0-flash"
FALLBACK_GROQ_MODEL = "llama-3.1-8b-instant"
DEFAULT_PROVIDER = os.getenv("LLM_PROVIDER", "google").strip().lower()
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", FALLBACK_GEMINI_MODEL).strip()
DEFAULT_GROQ_MODEL = os.getenv("GROQ_MODEL", FALLBACK_GROQ_MODEL).strip()


SYSTEM_PROMPT = """
You are IntelliCore, a polished agentic AI assistant with the clarity of ChatGPT and the document awareness of Gemini.

You can:
1. Answer normal questions.
2. Use tools when needed.
3. Search structured portfolio data about Abhishek Maurya.
4. Search uploaded documents using the RAG tool.
5. Search the web for latest/current information using Tavily Search.
6. Remember important user information using the memory tool.
7. Recall memory when useful.
8. Use calculator for math.

Rules:
- If the user asks about Abhishek, his portfolio, projects, skills, experience, education, certifications, GitHub, contact details, or suitability for an AI/ML role, call search_portfolio unless they explicitly ask about an uploaded file.
- If the user uploaded a document and asks about a person, resume, profile, project, skills, experience, education, contact details, "this file", "the PDF", or any content that may be inside the upload, call search_uploaded_documents first.
- If search_uploaded_documents returns relevant content, answer from that content and mention the uploaded document context naturally.
- Clearly distinguish whether an answer is based on portfolio knowledge, uploaded documents, memory, or web search.
- Do not answer uploaded-resume questions from public/general knowledge unless the document search found nothing and the user explicitly asks for web/general information.
- If the user asks about latest news, current events, recent updates, today's information, current prices, current people, current versions, new releases, or anything time-sensitive, use Tavily Search.
- If the user asks about an uploaded document, use search_uploaded_documents.
- If the user asks you to remember something, use remember_this.
- If the user asks about previous preferences or saved facts, use recall_memory.
- Use calculator for math questions.
- When using web search, summarize clearly and mention that the answer is based on web search results.
- Be direct, warm, and concise. Use short sections or bullets when they improve readability.
- If you are uncertain, say what you checked and ask for the missing context.
"""



def normalize_model_name(model_name: str | None) -> str:
    """
    Validate selected model from frontend.
    If model is missing or not allowed, fallback to the configured provider.
    """

    if not model_name:
        model_name = DEFAULT_GROQ_MODEL if DEFAULT_PROVIDER == "groq" else DEFAULT_GEMINI_MODEL

    model_name = model_name.strip()

    if model_name in ALLOWED_MODELS:
        return model_name

    if DEFAULT_PROVIDER == "groq":
        return DEFAULT_GROQ_MODEL if DEFAULT_GROQ_MODEL in GROQ_MODELS else FALLBACK_GROQ_MODEL

    return DEFAULT_GEMINI_MODEL if DEFAULT_GEMINI_MODEL in GEMINI_MODELS else FALLBACK_GEMINI_MODEL


def get_model_provider(model_name: str) -> str:
    if model_name in GROQ_MODELS:
        return "groq"

    return "google"




def build_agent(model_name: str):
    """
    Build one LangGraph agent for a selected model.
    """

    selected_model = normalize_model_name(model_name)
    provider = get_model_provider(selected_model)

    if provider == "groq":
        llm = ChatGroq(
            model=selected_model,
            temperature=0.7,
            max_retries=3,
        )
    else:
        llm = ChatGoogleGenerativeAI(
            model=selected_model,
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.7,
            max_retries=3,
        )

    llm_with_tools = llm.bind_tools(tools)

    def chatbot_node(state: MessagesState):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]

        response = llm_with_tools.invoke(messages)

        return {
            "messages": [response]
        }

    tool_node = ToolNode(tools)

    workflow = StateGraph(MessagesState)

    workflow.add_node("chatbot", chatbot_node)
    workflow.add_node("tools", tool_node)

    workflow.add_edge(START, "chatbot")
    workflow.add_conditional_edges("chatbot", tools_condition)
    workflow.add_edge("tools", "chatbot")

    conn = sqlite3.connect(
        str(DATA_DIR / "langgraph_checkpoints.sqlite"),
        check_same_thread=False
    )

    checkpointer = SqliteSaver(conn)

    return workflow.compile(checkpointer=checkpointer)


_AGENT_CACHE = {}


def get_agent(model_name: str | None = None):
    """
    Return cached LangGraph agent for selected model.
    If not created yet, create it once and reuse it.
    """

    selected_model = normalize_model_name(model_name)

    if selected_model not in _AGENT_CACHE:
        _AGENT_CACHE[selected_model] = build_agent(selected_model)

    return _AGENT_CACHE[selected_model]
