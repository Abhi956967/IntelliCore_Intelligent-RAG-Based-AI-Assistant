# 🚀 IntelliCore Quick Reference Guide

## 📋 First Time Setup (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/Abhi956967/IntelliCore_Intelligent-RAG-Based-AI-Assistant.git
cd IntelliCore_Intelligent-RAG-Based-AI-Assistant

# 2. Copy environment file
cp .env.example .env

# 3. Add your API keys to .env
# Edit these:
# - GOOGLE_API_KEY
# - TAVILY_API_KEY

# 4. Install dependencies
make install

# 5. Build frontend
make build

# 6. Run (in separate terminals)
# Terminal 1:
cd frontend && npm run dev

# Terminal 2:
python run.py
```

Open http://localhost:3000 ✨

---

## 🎯 Common Commands

### Development

```bash
# Run frontend dev server
cd frontend && npm run dev

# Run backend with auto-reload
python run.py

# Both at once (using Makefile)
make dev

# Run with Docker
make docker-compose
```

### Building & Testing

```bash
# Build frontend for production
make build

# Run tests
make test

# Lint code
make lint

# Clean build artifacts
make clean
```

### Docker

```bash
# Build production image
make docker-build

# Run container
make docker-run

# Stop container
make docker-stop

# Run full stack with compose
make docker-compose
```

---

## 🌐 Deployment Checklist

### ✅ Before Deploying

- [ ] Add all secrets to `.env`
- [ ] Test locally with `make docker-build && make docker-run`
- [ ] Run linting: `make lint`
- [ ] Frontend builds: `make build`
- [ ] API responds: `curl http://localhost:8000/health`

### ☁️ Deploy to Render (Easiest)

1. Push to GitHub: `git push origin main`
2. Create account on [Render.com](https://render.com)
3. Connect GitHub repo
4. Render auto-detects `render.yaml` and deploys!

### 🏗️ Deploy to AWS

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- ECR setup
- ECS Fargate configuration
- CloudFormation templates
- GitHub Actions automation

### 📦 Deploy to Docker Hub

```bash
# Build image
docker build -t yourusername/intellicore:latest -f Dockerfile.prod .

# Push to Docker Hub
docker push yourusername/intellicore:latest

# Anyone can run it with:
docker run -d --env-file .env -p 8000:8000 yourusername/intellicore:latest
```

---

## 🔧 Project Structure

```
IntelliCore/
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── App.tsx       # Main component
│   │   └── index.css     # Styling
│   └── package.json
│
├── app/                   # FastAPI backend
│   ├── main.py           # API server
│   ├── agents/           # LangGraph AI
│   ├── database/         # SQLite
│   ├── rag/              # Document processing
│   └── tools/            # AI tools
│
├── data/                 # Generated (SQLite)
├── uploads/              # Generated (Docs)
├── chroma_db/            # Generated (Vectors)
│
├── Dockerfile.prod       # Production image
├── docker-compose.yml    # Dev environment
├── requirements.txt      # Python deps
└── DEPLOYMENT_GUIDE.md   # Full deployment guide
```

---

## 🔌 API Examples

### Start a Chat

```bash
curl -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "thread_id": "user123",
    "model": "gemini-2.0-flash"
  }'
```

### Upload Document

```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@document.pdf" \
  -F "thread_id=user123"
```

### Get Conversation History

```bash
curl http://localhost:8000/history/user123
```

### Health Check

```bash
curl http://localhost:8000/health
```

---

## 🎨 Frontend Customization

### Change Colors

Edit `frontend/tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        600: '#your-color',
        // ...
      }
    }
  }
}
```

### Add New Component

```tsx
// frontend/src/components/MyComponent.tsx
export default function MyComponent() {
  return <div>Hello World</div>
}

// Use in App.tsx
import MyComponent from './components/MyComponent'

export default function App() {
  return <MyComponent />
}
```

### Change API URL

Frontend automatically proxies to `http://localhost:8000` in dev.

For production, update in code or set `VITE_API_URL` env var.

---

## 🔐 Environment Variables

### Required

```env
GOOGLE_API_KEY=sk-...           # Google Gemini API
TAVILY_API_KEY=tvly-...         # Web search API
GEMINI_MODEL=gemini-2.0-flash   # Which model to use
```

### Optional

```env
PORT=8000                       # Backend port
ENV=development                 # Environment mode
LANGSMITH_TRACING=true         # LLM tracing
LANGSMITH_API_KEY=ls-...       # LangSmith API
```

---

## 📊 Monitoring

### Health Check

```bash
# Every service
curl http://localhost:8000/health

# Response
{"status":"ok","service":"IntelliCore AI Assistant"}
```

### View Logs

```bash
# Backend logs
# Running via Python: See terminal output

# Docker logs
docker logs intellicore

# Docker Compose
docker-compose logs -f backend
```

### Performance

- Frontend build: ~150KB
- API response: <2s
- Document processing: <5s

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Or use different port
PORT=8001 python run.py
```

### API Connection Refused

```bash
# Is backend running?
curl http://localhost:8000/health

# Check .env file
cat .env | grep GOOGLE_API_KEY

# Restart backend
```

### Frontend Not Updating

```bash
# Clear cache
rm -rf frontend/node_modules/.vite

# Rebuild
cd frontend && npm run build
```

### Database Locked

```bash
# Reset SQLite
rm data/conversations.db

# Recreate
python -c "from app.database.operations import init_db; init_db()"
```

---

## 📚 Resources

- [API Docs](http://localhost:8000/docs) - Auto-generated Swagger
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [Frontend README](frontend/README.md) - Frontend details
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)

---

## 🤔 FAQs

**Q: How do I add authentication?**  
A: Add JWT middleware in `app/main.py` or use FastAPI's built-in security.

**Q: Can I use PostgreSQL?**  
A: Yes! Replace SQLAlchemy setup to use PostgreSQL connection.

**Q: How do I scale?**  
A: Use load balancers, caching (Redis), and multi-container orchestration (Kubernetes).

**Q: Is it production-ready?**  
A: Yes! It's containerized and has deployment configs for AWS/Render.

---

## 🎉 Next Steps

1. ✅ Set up locally
2. ✅ Try different prompts
3. ✅ Upload a document
4. ✅ Deploy to Render/AWS
5. ✅ Share with friends!

---

<div align="center">

**Happy coding! 🚀**

[Deployment Guide](DEPLOYMENT_GUIDE.md) · [Documentation](README.md) · [GitHub](https://github.com/Abhi956967/IntelliCore_Intelligent-RAG-Based-AI-Assistant)

</div>
