"""
Root launcher for IntelliCore AI Assistant.
Delegates to backend/run.py so you can run `python run.py` directly from the project root.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import run as backend_run

if __name__ == "__main__":
    backend_run.main()
