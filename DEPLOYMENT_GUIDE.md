# 🚀 IntelliCore - Full Stack Deployment Guide

## Overview

IntelliCore is a modern full-stack RAG-based AI Assistant with:
- **Frontend**: React + TypeScript + Tailwind CSS (Modern Minimalist UI)
- **Backend**: FastAPI + Python (AI and API)
- **AI**: Google Gemini + LangGraph + RAG Architecture
- **Database**: SQLite + ChromaDB (Vector Store)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker & Docker Compose (optional)
- Google Gemini API Key
- Tavily API Key

### Local Development

1. **Clone and Setup Backend**
```bash
# Install Python dependencies
python -m venv venv
source venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your API keys:
# GOOGLE_API_KEY=your_key
# TAVILY_API_KEY=your_key
# GEMINI_MODEL=gemini-2.0-flash
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Run Backend** (in another terminal)
```bash
python run.py
```

5. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
docker-compose up
```

This will start:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3000`

### Production Build

```bash
# Build production image
docker build -t intellicore:latest -f Dockerfile.prod .

# Run container
docker run -d \
  --name intellicore \
  --env-file .env \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/chroma_db:/app/chroma_db \
  intellicore:latest
```

---

## ☁️ Render Deployment

### Option 1: Using render.yaml

```bash
# Push to GitHub
git push origin main

# Deploy on Render
# 1. Connect your GitHub repo to Render
# 2. Render will automatically detect render.yaml
# 3. Set environment variables in Render dashboard:
#    - GOOGLE_API_KEY
#    - TAVILY_API_KEY
#    - GEMINI_MODEL
```

### Option 2: Manual Deployment

1. **Create Web Service on Render**
   - Connect GitHub repository
   - Set Build Command:
     ```
     pip install --upgrade pip && \
     pip install -r requirements.txt && \
     cd frontend && npm ci && npm run build && cd ..
     ```
   - Set Start Command: `python run.py`

2. **Set Environment Variables**
   - GOOGLE_API_KEY
   - TAVILY_API_KEY
   - GEMINI_MODEL
   - PORT (optional, defaults to 8000)

3. **Add Persistent Disk** (Optional)
   - Mount path: `/app/data`
   - Mount path: `/app/uploads`
   - Mount path: `/app/chroma_db`

### Environment Variables on Render

```
GOOGLE_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
GEMINI_MODEL=gemini-2.0-flash
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=ls-...
```

---

## 🏗️ AWS Deployment

### Prerequisites

- AWS Account
- AWS CLI configured
- ECR Repository created

### Option 1: Using CloudFormation

1. **Build and Push Docker Image to ECR**
```bash
# Set variables
AWS_ACCOUNT_ID=your_account_id
AWS_REGION=us-east-1
ECR_REPO=intellicore

# Create ECR repository
aws ecr create-repository --repository-name $ECR_REPO --region $AWS_REGION

# Build and push
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker build -t $ECR_REPO:latest -f Dockerfile.prod .

docker tag $ECR_REPO:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest
```

2. **Deploy with CloudFormation**
```bash
aws cloudformation create-stack \
  --stack-name intellicore-stack \
  --template-body file://aws-cloudformation.yaml \
  --parameters ParameterKey=DockerImage,ParameterValue=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest \
  --region $AWS_REGION
```

3. **Configure Environment Variables in ECS**
   - GOOGLE_API_KEY
   - TAVILY_API_KEY
   - GEMINI_MODEL

### Option 2: Using AWS CodeBuild + CodeDeploy

1. **Create CodeBuild Project**
```bash
# Update buildspec.yml with your AWS details
aws codebuild create-project \
  --name intellicore-build \
  --source type=GITHUB,location=https://github.com/your-repo.git \
  --artifacts type=NO_ARTIFACTS \
  --environment type=LINUX_CONTAINER,image=aws/codebuild/standard:5.0,computeType=BUILD_GENERAL1_MEDIUM
```

2. **Create CodeDeploy Application**
```bash
aws deploy create-app \
  --application-name IntelliCore \
  --region $AWS_REGION
```

3. **Configure GitHub Actions** (See `.github/workflows/deploy.yml`)

### Option 3: Using ECS Fargate (Recommended)

1. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name intellicore-cluster
```

2. **Create Task Definition**
```bash
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json
```

3. **Create Service**
```bash
aws ecs create-service \
  --cluster intellicore-cluster \
  --service-name intellicore-service \
  --task-definition intellicore:latest \
  --desired-count 1 \
  --launch-type FARGATE
```

---

## 🔐 Security Best Practices

### For Production

1. **Enable HTTPS**
   - Use AWS Certificate Manager (ACM)
   - Configure Load Balancer with SSL
   - Or use Let's Encrypt with Nginx reverse proxy

2. **API Authentication**
   - Add JWT authentication
   - Rate limiting
   - CORS configuration

3. **Secrets Management**
   - Use AWS Secrets Manager
   - Never commit `.env` files
   - Rotate API keys regularly

4. **Database**
   - Use PostgreSQL instead of SQLite for production
   - Enable database backups
   - Use encrypted connections

5. **Monitoring**
   - Enable CloudWatch logging
   - Set up alarms for errors
   - Monitor API latency

---

## 📊 Monitoring & Logging

### Render
- Logs available in Render Dashboard
- Use Render's built-in monitoring

### AWS
```bash
# View logs
aws logs tail /ecs/intellicore --follow

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name intellicore-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

See `.github/workflows/deploy.yml` for automated deployment on push to main:

1. Build and test
2. Build Docker image
3. Push to ECR
4. Deploy to ECS/Render

---

## 🛠️ Troubleshooting

### Frontend not loading
```bash
# Check if frontend_dist exists
ls -la frontend_dist/

# Rebuild frontend
cd frontend && npm run build && cd ..
```

### API connection errors
```bash
# Check backend is running
curl http://localhost:8000/health

# Check CORS is enabled
curl -H "Origin: http://localhost:3000" http://localhost:8000/health
```

### Environment variables not loading
```bash
# Verify .env file
cat .env

# Check in Docker container
docker exec intellicore env | grep GOOGLE_API_KEY
```

### Database errors
```bash
# Reset SQLite database
rm data/conversations.db
python -c "from app.database.operations import init_db; init_db()"
```

---

## 📈 Scaling Considerations

### For Production Scale:

1. **Database**
   - Migrate from SQLite to PostgreSQL
   - Add read replicas
   - Enable connection pooling

2. **Caching**
   - Add Redis for session/memory caching
   - Cache LLM responses

3. **Load Balancing**
   - Use AWS ALB/NLB
   - Auto-scaling groups
   - Multi-region deployment

4. **CDN**
   - CloudFront for static assets
   - Reduce latency globally

5. **Monitoring**
   - LangSmith for LLM tracing
   - DataDog/New Relic for monitoring
   - Error tracking with Sentry

---

## 📚 Additional Resources

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://react.dev/learn/start-a-new-react-project)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Render Deployment Guide](https://render.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🤝 Support

For issues or questions:
- Check documentation
- Review GitHub Issues
- Submit detailed bug reports

---

**Happy Deploying! 🚀**
