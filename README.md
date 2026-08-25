# IntelliCore — Intelligent RAG-Based AI Assistant & Portfolio

IntelliCore is an end-to-end full-stack Agentic AI platform featuring an interactive developer portfolio landing page and an intelligent multi-LLM RAG assistant. It combines **FastAPI**, **LangGraph**, **Google Gemini**, **Groq**, **Tavily Web Search**, **ChromaDB Vector Store**, **SQLite persistence**, and a **React + TypeScript + Tailwind CSS** frontend.

---

## Architecture Overview

```text
                               ┌────────────────────────────────┐
                               │   React + Vite + Tailwind UI   │
                               │   (Landing Page + Chat Hub)    │
                               └───────────────┬────────────────┘
                                               │ (HTTP / SSE Streams)
                                               ▼
                               ┌────────────────────────────────┐
                               │       FastAPI Backend API      │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │     LangGraph Agent Engine     │
                               └───────┬───────────────┬────────┘
                                       │               │
                     ┌─────────────────┴─┐           ┌─┴─────────────────┐
                     │ LLM Model Providers│           │   Integrated Tools │
                     │ • Gemini 3.6 Flash │           │ • Tavily Web Search│
                     │ • Qwen 3.6 27B     │           │ • Document RAG     │
                     │ • GPT OSS 20B      │           │ • Long-Term Memory │
                     │ • Auto-Fallback    │           │ • Calculator       │
                     └───────────────────┘           │ • Portfolio Info   │
                                                     └─────────┬─────────┘
                                                               │
                                             ┌─────────────────┴─────────┐
                                             │ ChromaDB  │  SQLite DB    │
                                             └───────────────────────────┘
```

---

## Directory Structure

```text
Intelligent RAG-Based AI Assistant/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   └── chatbot_agent.py      # LangGraph multi-model agent & fallback workflow
│   │   ├── database/
│   │   │   └── operations.py         # SQLite models, chat histories, memory
│   │   ├── portfolio/
│   │   │   └── knowledge.py          # Structured portfolio & resume knowledge
│   │   ├── rag/
│   │   │   └── service.py            # Document loader, chunker, ChromaDB vector search
│   │   ├── templates/                # Jinja fallback template
│   │   ├── tools/
│   │   │   └── agent_tools.py        # Web search, calculator, memory & document tools
│   │   ├── storage.py                # Storage directories resolution
│   │   ├── main.py                   # FastAPI app, SSE streaming endpoints, file uploads
│   │   └── __init__.py
│   ├── tests/
│   │   └── test_api.py               # Automated pytest suite
│   ├── data/                         # SQLite databases (checkpoints, chats, memory)
│   ├── uploads/                      # Uploaded knowledge base documents
│   ├── chroma_db/                    # Chroma vector database embeddings
│   ├── Dockerfile                    # Backend production Dockerfile
│   ├── requirements.txt              # Python dependencies
│   └── run.py                        # Backend local launcher
│
├── frontend/
│   ├── src/
│   │   ├── components/               # UI components (Hero, Features, ChatWindow, etc.)
│   │   ├── App.tsx                   # App layout & view management
│   │   ├── index.css                 # Aurora animations, glassmorphism & Tailwind styles
│   │   ├── main.tsx                  # React entry point
│   │   └── types.ts                  # TypeScript definitions
│   ├── public/                       # Static public assets
│   ├── index.html                    # HTML root entry
│   ├── package.json                  # Node dependencies & build scripts
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── tsconfig.json                 # TypeScript compiler options
│   ├── vite.config.ts                # Vite config & API reverse proxies
│   └── Dockerfile                    # Frontend production Dockerfile
│
├── .env                              # Environment variables (API keys & configuration)
├── .gitignore                        # Git exclusion rules
├── docker-compose.yml                # Multi-container orchestration
└── README.md                         # Project documentation
```

---

## Key Capabilities

1. **Agentic AI & Multi-LLM Routing**:
   * Supports Google Gemini (`gemini-3.6-flash`, `gemini-3.5-flash-lite`) and Groq (`qwen/qwen3.6-27b`, `openai/gpt-oss-20b`).
   * Automated cross-provider fallback if any model provider experiences downtime or rate limits.

2. **RAG (Retrieval-Augmented Generation)**:
   * Upload PDF, DOCX, TXT, MD, PY, or CSV files directly into the conversation.
   * Semantic chunking and vector indexing with **ChromaDB**.

3. **Web Search & Real-Time Intelligence**:
   * Integrated **Tavily Web Search** for real-time news, current events, and live queries.

4. **Persistent Long-Term Memory**:
   * Explicit memory store (`remember_this`, `recall_memory`) saved across sessions.
   * SQLite conversation thread tracking and history retrieval.

5. **Modern Interactive UI**:
   * Developer portfolio landing page with 3D tilt cards, system pipeline diagram, contribution heatmap, and smooth animations.
   * Complete chat workspace with markdown rendering, source citations, TTS voice narration, export options, and dark/light themes.

---

## Getting Started

### 1. Prerequisites
* **Python**: 3.11+
* **Node.js**: 18+ and npm
* **API Keys**:
  * [Google AI Studio](https://aistudio.google.com/) (`GOOGLE_API_KEY`)
  * [Groq Cloud](https://console.groq.com/) (`GROQ_API_KEY`)
  * [Tavily AI](https://tavily.com/) (`TAVILY_API_KEY`)

---

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# ============= API KEYS =============
GOOGLE_API_KEY="your_google_gemini_api_key"
GROQ_API_KEY="your_groq_api_key"
TAVILY_API_KEY="your_tavily_api_key"

# ============= MODEL CONFIGURATION =============
LLM_PROVIDER="google"
GEMINI_MODEL="gemini-3.6-flash"
GROQ_MODEL="qwen/qwen3.6-27b"

# ============= SERVER SETTINGS =============
PORT=8000
ENV=development
```

---

### 3. Local Development

#### A. Backend Setup
```bash
# From project root
cd backend
python -m venv ../venv
# Activate venv:
# Windows: ..\venv\Scripts\activate
# Linux/macOS: source ../venv/bin/activate

pip install -r requirements.txt
python run.py
```
Backend starts on **http://localhost:8000** (with health endpoint at `/health`).

#### B. Frontend Setup
```bash
# In a new terminal from project root
cd frontend
npm install
npm run dev
```
Frontend development server opens at **http://localhost:3000** with hot reload and automatic API proxying to `http://localhost:8000`.

---

### 4. Running with Docker Compose

Run the entire full-stack application using Docker:

```bash
docker-compose up --build
```

* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:8000`

---

### 5. Running Tests

Run backend unit tests and route checks:

```bash
python -m pytest backend/tests
```

Run frontend build verification:

```bash
cd frontend
npm run build
```

---

## License

This project is licensed under the terms of the MIT License.
