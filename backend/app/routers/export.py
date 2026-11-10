from fastapi import APIRouter, HTTPException
from app.state import state
from app.core.citations import CitationGenerator
from app.models.schemas import CitationResponse, NotesExportResponse

router = APIRouter(prefix="/export", tags=["Citations & Export"])

@router.get("/citations/{doc_id}", response_model=CitationResponse)
def get_citations(doc_id: str):
    """Generates APA, IEEE, and BibTeX citations for a paper."""
    if doc_id not in state.documents:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc_meta = state.documents[doc_id]
    citations = CitationGenerator.generate_all_formats(doc_meta)
    
    return CitationResponse(
        doc_id=doc_id,
        title=doc_meta.get("title", doc_id),
        apa=citations["apa"],
        ieee=citations["ieee"],
        bibtex=citations["bibtex"]
    )

@router.get("/notes/{doc_id}", response_model=NotesExportResponse)
def export_notes(doc_id: str):
    """Generates complete Markdown research notes ready for export or download."""
    if doc_id not in state.documents:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc_meta = state.documents[doc_id]
    summary = state.rag_engine.generate_summary(doc_id, doc_meta)
    markdown_content = CitationGenerator.export_markdown_notes(doc_meta, summary)

    return NotesExportResponse(
        doc_id=doc_id,
        title=doc_meta.get("title", doc_id),
        markdown_content=markdown_content
    )

