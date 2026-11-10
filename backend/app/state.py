import datetime
from pathlib import Path
from typing import Dict, Any
from app.core.vector_store import VectorStore
from app.core.chunker import SemanticChunker
from app.core.rag_engine import RAGEngine
from app.config import settings

class AppState:
    def __init__(self):
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.chunker = SemanticChunker(
            chunk_size_words=settings.chunk_size,
            overlap_words=settings.chunk_overlap
        )
        self.vector_store = VectorStore(dimension=settings.embedding_dimension)
        self.rag_engine = RAGEngine(self.vector_store)

state = AppState()

