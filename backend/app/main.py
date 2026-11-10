from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import documents, search, qa, summary, export

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Multi-document scientific research analysis engine with vector search, RAG, and offline local mode."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(documents.router, prefix=settings.api_prefix)
app.include_router(search.router, prefix=settings.api_prefix)
app.include_router(qa.router, prefix=settings.api_prefix)
app.include_router(summary.router, prefix=settings.api_prefix)
app.include_router(export.router, prefix=settings.api_prefix)

@app.get("/")
def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "offline_mode": settings.offline_mode,
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

