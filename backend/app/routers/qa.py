from fastapi import APIRouter
from app.state import state
from app.models.schemas import QuestionRequest, QuestionResponse

router = APIRouter(prefix="/qa", tags=["Question Answering"])

@router.post("/query", response_model=QuestionResponse)
def query_paper(req: QuestionRequest):
    """Answers research queries with source attribution and page citations."""
    result = state.rag_engine.answer_question(
        question=req.question,
        doc_ids=req.doc_ids,
        top_k=req.top_k,
        offline_mode=req.offline_mode
    )
    return QuestionResponse(**result)

