import uuid
import datetime
import shutil
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.state import state
from app.config import settings
from app.core.pdf_parser import PDFParser
from app.models.schemas import DocumentMetadata

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentMetadata)
async def upload_document(file: UploadFile = File(...)):
    """Uploads a PDF or text document, extracts text, chunks it, and indexes vectors."""
    if not file.filename.lower().endswith(('.pdf', '.txt', '.md')):
        raise HTTPException(status_code=400, detail="Only .pdf, .txt, and .md files are supported.")

    doc_id = str(uuid.uuid4())[:8]
    save_path = settings.storage_path / f"{doc_id}_{file.filename}"
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        pages, raw_meta = PDFParser.extract_text_and_metadata(save_path)
        if not pages:
            raise HTTPException(status_code=400, detail="Could not extract readable text from document.")

        # Chunk document
        chunks = state.chunker.chunk_document(doc_id, pages)
        
        # Index in vector store
        state.vector_store.add_chunks(chunks)

        # Store metadata
        doc_meta = {
            "doc_id": doc_id,
            "filename": file.filename,
            "title": raw_meta.get("title") or file.filename,
            "authors": raw_meta.get("authors", ["Researcher"]),
            "year": raw_meta.get("year", 2026),
            "total_pages": len(pages),
            "total_chunks": len(chunks),
            "file_size_bytes": save_path.stat().st_size,
            "upload_timestamp": datetime.datetime.now().isoformat()
        }
        state.documents[doc_id] = doc_meta
        return doc_meta

    except Exception as e:
        if save_path.exists():
            save_path.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.get("", response_model=List[DocumentMetadata])
def list_documents():
    """Lists all currently uploaded and indexed research papers."""
    return list(state.documents.values())

@router.get("/{doc_id}", response_model=DocumentMetadata)
def get_document(doc_id: str):
    """Retrieves metadata for a specific document."""
    if doc_id not in state.documents:
        raise HTTPException(status_code=404, detail="Document not found.")
    return state.documents[doc_id]

@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    """Deletes a document and purges its vector embeddings."""
    if doc_id not in state.documents:
        raise HTTPException(status_code=404, detail="Document not found.")

    state.vector_store.remove_document(doc_id)
    del state.documents[doc_id]
    return {"status": "success", "message": f"Document {doc_id} and associated vector index removed."}

