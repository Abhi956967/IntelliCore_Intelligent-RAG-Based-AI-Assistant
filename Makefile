.PHONY: help install dev build deploy docker-build docker-run test lint clean

help:
	@echo "IntelliCore - Full Stack AI Assistant"
	@echo ""
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev           - Run frontend and backend in development mode"
	@echo "  make build         - Build frontend for production"
	@echo "  make test          - Run tests"
	@echo "  make lint          - Lint code"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make docker-build  - Build production Docker image"
	@echo "  make docker-run    - Run Docker container"
	@echo "  make docker-compose- Run with Docker Compose"
	@echo ""

install:
	pip install -r requirements.txt
	cd frontend && npm install && cd ..

dev:
	@echo "Starting IntelliCore development environment..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Run in separate terminals:"
	@echo "  Terminal 1: cd frontend && npm run dev"
	@echo "  Terminal 2: python run.py"

build:
	cd frontend && npm run build && cd ..
	@echo "✓ Frontend built successfully in frontend/dist/"

test:
	pytest tests/ -v

lint:
	cd frontend && npm run lint && cd ..
	pylint app/ --disable=all --enable=E,F || true

clean:
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf __pycache__
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete

docker-build:
	docker build -t intellicore:latest -f Dockerfile.prod .
	@echo "✓ Docker image built: intellicore:latest"

docker-run:
	docker run -d \
		--name intellicore \
		--env-file .env \
		-p 8000:8000 \
		-v $$(pwd)/data:/app/data \
		-v $$(pwd)/uploads:/app/uploads \
		-v $$(pwd)/chroma_db:/app/chroma_db \
		intellicore:latest
	@echo "✓ Container started on http://localhost:8000"

docker-stop:
	docker stop intellicore || true
	docker rm intellicore || true

docker-compose:
	docker-compose up

env-copy:
	cp .env.example .env
	@echo "✓ Created .env file. Don't forget to add your API keys!"

.DEFAULT_GOAL := help
