from fastapi import APIRouter
from app.state import state
from app.models.schemas import SearchQuery, SearchResult, TextChunk

router = APIRouter(prefix="/search", tags=["Vector Search"])

@router.post("", response_model=SearchResult)
def semantic_search(query_req: SearchQuery):
    """Executes high-dimensional semantic search over indexed paper chunks."""
    matches = state.vector_store.search(
        query=query_req.query,
        top_k=query_req.top_k,
        doc_ids=query_req.doc_ids
    )

    formatted_matches = [
        TextChunk(
            chunk_id=m["chunk_id"],
            doc_id=m["doc_id"],
            page_number=m["page_number"],
            text=m["text"],
            token_count=m["token_count"],
            score=round(m.get("score", 0.0), 4)
        )
        for m in matches
    ]

    return SearchResult(
        query=query_req.query,
        matches=formatted_matches,
        total_matches=len(formatted_matches)
    )

