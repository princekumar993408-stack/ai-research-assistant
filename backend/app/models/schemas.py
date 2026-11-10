from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class DocumentMetadata(BaseModel):
    doc_id: str
    filename: str
    title: Optional[str] = None
    authors: Optional[List[str]] = Field(default_factory=list)
    year: Optional[int] = None
    total_pages: int
    total_chunks: int
    file_size_bytes: int
    upload_timestamp: str

class TextChunk(BaseModel):
    chunk_id: str
    doc_id: str
    page_number: int
    text: str
    token_count: int
    score: Optional[float] = None

class SearchQuery(BaseModel):
    query: str
    doc_ids: Optional[List[str]] = None
    top_k: int = 5

class SearchResult(BaseModel):
    query: str
    matches: List[TextChunk]
    total_matches: int

class QuestionRequest(BaseModel):
    question: str
    doc_ids: Optional[List[str]] = None
    top_k: int = 4
    offline_mode: bool = True

class QuestionResponse(BaseModel):
    question: str
    answer: str
    citations: List[Dict[str, Any]]
    confidence_score: float
    retrieval_mode: str

class SummaryRequest(BaseModel):
    doc_id: str
    summary_type: str = "comprehensive"  # "brief", "comprehensive", "methodology", "findings"

class SummaryResponse(BaseModel):
    doc_id: str
    title: str
    summary: str
    key_findings: List[str]
    methodology: str
    limitations: Optional[str] = None

class CompareRequest(BaseModel):
    doc_ids: List[str]

class ComparisonDimension(BaseModel):
    dimension: str
    comparisons: Dict[str, str]

class CompareResponse(BaseModel):
    documents_compared: List[str]
    comparison_matrix: List[ComparisonDimension]
    synthesis: str

class CitationResponse(BaseModel):
    doc_id: str
    title: str
    apa: str
    ieee: str
    bibtex: str

class NotesExportResponse(BaseModel):
    doc_id: str
    title: str
    markdown_content: str

