from fastapi import APIRouter, HTTPException
from app.state import state
from app.models.schemas import SummaryRequest, SummaryResponse, CompareRequest, CompareResponse

router = APIRouter(prefix="/analysis", tags=["Summarization & Comparison"])

@router.post("/summarize", response_model=SummaryResponse)
def summarize_paper(req: SummaryRequest):
    """Generates structured executive summary, methodology, and key findings."""
    if req.doc_id not in state.documents:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc_meta = state.documents[req.doc_id]
    summary = state.rag_engine.generate_summary(req.doc_id, doc_meta)
    return SummaryResponse(**summary)

@router.post("/compare", response_model=CompareResponse)
def compare_papers(req: CompareRequest):
    """Generates a cross-document methodology and outcomes comparison matrix."""
    if len(req.doc_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 document IDs to compare.")

    for d_id in req.doc_ids:
        if d_id not in state.documents:
            raise HTTPException(status_code=404, detail=f"Document {d_id} not found.")

    comparison = state.rag_engine.compare_documents(req.doc_ids, state.documents)
    return CompareResponse(**comparison)

