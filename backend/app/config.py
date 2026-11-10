import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
STORAGE_DIR = DATA_DIR / "storage"
SAMPLE_PAPERS_DIR = DATA_DIR / "sample_papers"

# Ensure directories exist
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_PAPERS_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    app_name: str = "AI Research Assistant"
    app_version: str = "1.0.0"
    chunk_size: int = 400
    chunk_overlap: int = 50
    embedding_dimension: int = 128
    offline_mode: bool = True
    storage_path: Path = STORAGE_DIR
    api_prefix: str = "/api"

settings = Settings()

