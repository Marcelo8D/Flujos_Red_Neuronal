from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import database
from app.database import engine, Base

# Import routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events
    Tests database connection on startup
    """
    logger.info("🚀 Starting Neural Network Visualization API...")
    
    # Test database connection
    try:
        # Try to connect to database
        with engine.connect() as connection:
            logger.info("✅ Database connection successful!")
            logger.info(f"📊 Connected to: {engine.url.database}")
            logger.info(f"🔗 Host: {engine.url.host}")
    except Exception as e:
        logger.error("❌ Database connection failed!")
        logger.error(f"Error: {str(e)}")
        raise
    
    logger.info("✨ Application startup complete!")
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("👋 Shutting down application...")
    engine.dispose()
    logger.info("✅ Cleanup complete!")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Neural Network Visualization API",
    description="Interactive visualization of neural network activation patterns",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Neural Network Visualization API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        with engine.connect() as connection:
            return {
                "status": "healthy",
                "database": "connected",
                "version": "1.0.0"
            }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )