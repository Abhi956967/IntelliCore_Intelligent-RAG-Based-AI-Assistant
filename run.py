import uvicorn
import os

if __name__ == "__main__":
    # Use port 8000 for production, 8080 for development
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("ENV", "development") == "development"
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=reload
    )

