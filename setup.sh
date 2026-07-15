#!/bin/bash

# IntelliCore - Installation & Setup Script
# Run this to set up the full-stack application

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  🚀 IntelliCore Setup Script                  ║"
echo "║           Intelligent RAG-Based AI Assistant                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Python
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.11+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python found${NC}"

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env and add your API keys:${NC}"
    echo "   - GOOGLE_API_KEY"
    echo "   - TAVILY_API_KEY"
    echo ""
    read -p "Press Enter after updating .env..."
fi

# Create Python virtual environment
echo ""
echo "Setting up Python environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    source .venv/Scripts/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Python dependencies installed${NC}"

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
npm run build
cd ..
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Create directories
echo ""
echo "Creating required directories..."
mkdir -p data uploads chroma_db
echo -e "${GREEN}✓ Directories created${NC}"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  ✨ Setup Complete! ✨                         ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  📖 Documentation:                                             ║"
echo "║     - SETUP_COMPLETE.md  - Setup overview                      ║"
echo "║     - QUICK_REFERENCE.md - Common commands                     ║"
echo "║     - DEPLOYMENT_GUIDE.md - Deployment to AWS/Render           ║"
echo "║                                                                ║"
echo "║  🚀 Next Steps:                                                ║"
echo "║     1. Start backend:   python run.py                          ║"
echo "║     2. Start frontend:  cd frontend && npm run dev             ║"
echo "║     3. Open:            http://localhost:3000                  ║"
echo "║                                                                ║"
echo "║  🐳 Or use Docker:      docker-compose up                      ║"
echo "║                                                                ║"
echo "║  ☁️  Deploy to Render:   git push && connect on render.com      ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Happy coding! 🎉${NC}"
