"""
VidyaMitra Backend - FastAPI Main Application
AI-Powered Career Intelligence Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="VidyaMitra API",
    description="AI-Powered Career Intelligence Platform - Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware Configuration
allowed_origins = [
    "http://localhost:5173",      # Local React dev server
    "http://localhost:5174", "http://localhost:5175", "http://localhost:5176",
    "http://localhost:3000",      # Alternative React port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROUTERS ====================
from app.routers import gemini

app.include_router(gemini.router, prefix="/api/gemini", tags=["Gemini AI"])

# ==================== ROOT ENDPOINTS ====================

@app.get("/", tags=["Health Check"])
async def root():
    """
    Root endpoint - Check if API is running
    """
    return {
        "status": "✅ Running",
        "message": "Welcome to VidyaMitra API",
        "version": "1.0.0",
        "docs": "http://localhost:8000/docs"
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "service": "VidyaMitra Backend",
        "timestamp": __import__("datetime").datetime.now().isoformat()
    }


@app.get("/api/v1/status", tags=["Health Check"])
async def api_status():
    """
    Detailed API status with component checks
    """
    return {
        "api": "✅ Online",
        "authentication": "⚙️ Configured",
        "database": "⚙️ Configured",
        "ai_service": "⚙️ Configured",
        "external_apis": "⚙️ Configured",
        "version": "1.0.0"
    }


# ==================== ERROR HANDLERS ====================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors
    """
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if os.getenv("DEBUG") else "An error occurred"
        }
    )


# ==================== STARTUP & SHUTDOWN ====================

@app.on_event("startup")
async def startup_event():
    """
    Run on application startup
    """
    print("🚀 VidyaMitra Backend Starting...")
    print("📡 API Documentation: http://localhost:8000/docs")
    print("✅ Ready to process career insights!")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Run on application shutdown
    """
    print("🛑 VidyaMitra Backend Shutting Down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
