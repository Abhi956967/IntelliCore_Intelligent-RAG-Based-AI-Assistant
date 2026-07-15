# Intelligent RAG-Based AI Assistant — Agentic AI Chatbot

BappyGPT is a full-stack Agentic AI chatbot built with **FastAPI, LangGraph, Google Gemini, Tavily, RAG, ChromaDB, and SQLite**. It can answer normal questions, stream responses, search the web, read uploaded documents, perform calculations, and save long-term conversation memory.

## System build flow

```text
User
  ↓
HTML/CSS/JavaScript Frontend
  ↓
FastAPI API
  ↓
LangGraph Agent
  ↓
Google Gemini
  ├── Tavily Web Search
  ├── Calculator Tool
  ├── RAG Document Search
  │      ↓
  │   ChromaDB Vector Store
  └── Long-Term Memory
         ↓
      SQLite Database
```

## Project structure

```text
BappyGPT/
├── .github/workflows/cicd.yaml   # GitHub Actions: ECR + EC2 deployment
├── app/
│   ├── main.py                   # FastAPI app, routes, uploads, SSE streaming
│   ├── agents/
│   │   └── chatbot_agent.py      # Gemini model and LangGraph workflow
│   ├── database/
│   │   └── operations.py         # SQLAlchemy models and database functions
│   ├── rag/
│   │   └── service.py            # File loading, chunking, embeddings, retrieval
│   ├── tools/
│   │   └── agent_tools.py        # Calculator, web, RAG, and memory tools
│   └── templates/
│       └── index.html             # Chat user interface
├── chroma_db/                    # Generated local vector database
├── data/                         # Generated SQLite databases
├── uploads/                      # Uploaded documents
├── tests/test_api.py             # Basic API test
├── .env.example                  # Environment variable template
├── Dockerfile                    # Production container
├── requirements.txt              # Python dependencies
├── run.py                        # Local development entry point
└── README.md
```

## What each layer does

- **Frontend:** sends chat messages, selects a Gemini model, uploads documents, and displays streamed responses.
- **FastAPI:** exposes the web page and API endpoints, validates uploads, saves chat messages, and streams output using Server-Sent Events (SSE).
- **LangGraph agent:** decides whether Gemini should answer directly or call a tool. SQLite checkpoints preserve graph state by thread.
- **RAG:** loads an uploaded file, splits it into chunks, creates embeddings, stores them in ChromaDB, and retrieves relevant chunks for a question.
- **Tools:** provide calculator, Tavily web search, uploaded-document search, memory saving, and memory recall.
- **SQLite:** stores conversations, chat history, long-term memories, and LangGraph checkpoints.

## Prerequisites

Install the following before starting:

- Python 3.11 or newer
- Git
- A Google Gemini API key
- A Tavily API key for web search
- Docker (optional, for container deployment)

## Step 1 — Clone the project

```bash
git clone <your-repository-url>
cd BappyGPT
```

## Step 2 — Create a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```cmd
python -m venv .venv
.venv\Scripts\activate
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Step 3 — Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Step 4 — Configure environment variables

Copy `.env.example` to `.env`.

Windows:

```cmd
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Open `.env` and add your keys:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
TAVILY_API_KEY=your_tavily_api_key
```

Never commit the `.env` file to GitHub.

## Step 5 — Run locally

Recommended:

```bash
python run.py
```

Alternative:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

Open `http://127.0.0.1:8080` in your browser.

## Step 6 — Test the features

1. Send a normal question to test Gemini.
2. Ask a calculation such as `sqrt(144) + 10` to test the calculator.
3. Ask for current information to test Tavily web search.
4. Upload a PDF, DOCX, TXT, MD, PY, or CSV file.
5. Ask a question about the uploaded file to test RAG.
6. Ask the bot to remember a preference, then ask it to recall that preference.
7. Refresh the page and open an old conversation to test chat persistence.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Render the chat interface |
| GET | `/conversations` | Return saved conversations |
| GET | `/history/{thread_id}` | Return chat history for one thread |
| POST | `/upload` | Upload and index a document |
| POST | `/chat/stream` | Stream the agent response with SSE |

## How a chat request works

1. The browser sends `message`, `thread_id`, and selected `model` to `/chat/stream`.
2. FastAPI saves the user message in SQLite.
3. `get_agent()` loads or reuses the selected Gemini agent.
4. LangGraph sends the conversation and system prompt to Gemini.
5. Gemini either answers directly or requests a tool.
6. LangGraph executes the tool and returns its result to Gemini.
7. Normal AI text chunks are streamed to the browser; raw tool output is hidden.
8. The completed assistant answer is saved in SQLite.

## How document RAG works

1. A file is uploaded to `/upload` with its conversation `thread_id`.
2. FastAPI validates the extension and saves the file in `uploads/`.
3. The RAG service loads the document text.
4. The text is divided into smaller overlapping chunks.
5. Embeddings are generated and stored in `chroma_db/`.
6. When the user asks about the document, the RAG tool searches only the relevant thread's content.
7. The retrieved context is returned to Gemini to generate a grounded answer.

## Run tests

Install pytest if needed:

```bash
pip install pytest httpx
pytest
```

## Docker setup

Build the image:

```bash
docker build -t bappygpt .
```

Run it with your `.env` file and persistent storage:

```bash
docker run -d \
  --name bappygpt \
  --env-file .env \
  -p 8080:8080 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/uploads:/app/uploads" \
  -v "$(pwd)/chroma_db:/app/chroma_db" \
  bappygpt
```

On Windows PowerShell, use `${PWD}` instead of `$(pwd)`.

## AWS ECR + EC2 deployment

The workflow in `.github/workflows/cicd.yaml` performs two jobs:

1. **Continuous Integration:** checks out the code, logs in to Amazon ECR, builds the Docker image, and pushes the `latest` image.
2. **Continuous Deployment:** a self-hosted GitHub Actions runner on EC2 pulls the image, replaces the old container, and starts the new version.

Add these GitHub repository secrets:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
ECR_REPO
GOOGLE_API_KEY
GEMINI_MODEL
TAVILY_API_KEY
LANGSMITH_TRACING
LANGSMITH_ENDPOINT
LANGSMITH_API_KEY
LANGSMITH_PROJECT
```

The EC2 machine must have Docker installed, an active self-hosted GitHub Actions runner, access to ECR, and inbound TCP port `8080` allowed in its security group.

## Common errors

**`ModuleNotFoundError: No module named 'app'`**  
Run the command from the project root, not from inside the `app` folder:

```bash
uvicorn app.main:app --reload --port 8080
```

**`GOOGLE_API_KEY` error**  
Check that `.env` exists in the project root and contains a valid key. Restart the server after changing it.

**Tavily search does not work**  
Add a valid `TAVILY_API_KEY` to `.env` and restart the app.

**Uploaded document cannot be read**  
Use a supported extension: PDF, DOCX, TXT, MD, PY, or CSV. Also check that the `uploads/` directory is writable.

**Port 8080 is already in use**  
Use another port:

```bash
uvicorn app.main:app --reload --port 8000
```

**Old Chroma data causes problems**  
Stop the server, delete the generated contents of `chroma_db/`, and upload the documents again.

## Security and production notes

- Keep API keys only in environment variables or GitHub Secrets.
- Do not commit `.env`, uploaded documents, SQLite files, or ChromaDB runtime data.
- Add authentication before exposing private conversations publicly.
- Add upload size limits and stronger filename sanitization for public deployments.
- Use HTTPS through Nginx, Caddy, an AWS load balancer, or another reverse proxy.
- Back up `data/` and `chroma_db/` if persistent memory is important.

## Future improvements

- User authentication
- Multiple files per knowledge base
- Source citations in RAG answers
- Delete and rename conversations
- Conversation search
- Redis-based shared state
- PostgreSQL for production
- Background document processing
- Automated linting and complete API tests

## License

This project is licensed under the terms in the `LICENSE` file.
