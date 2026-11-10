try:
    import pytest
except ImportError:
    pytest = None

import numpy as np
from app.core.chunker import SemanticChunker
from app.core.vector_store import VectorStore
from app.core.rag_engine import RAGEngine
from app.core.citations import CitationGenerator

def test_semantic_chunker():
    chunker = SemanticChunker(chunk_size_words=20, overlap_words=5)
    pages = [
        {
            "page_number": 1,
            "text": "This is a paragraph discussing artificial intelligence and edge computing in IoT architectures. " * 3
        },
        {
            "page_number": 2,
            "text": "The second page explores empirical energy telemetry from microbial fuel cells under load. " * 3
        }
    ]
    chunks = chunker.chunk_document("doc_test", pages)
    assert len(chunks) >= 2
    assert chunks[0]["doc_id"] == "doc_test"
    assert chunks[0]["page_number"] == 1
    assert "text" in chunks[0]

def test_vector_store():
    store = VectorStore(dimension=64)
    chunks = [
        {"chunk_id": "c1", "doc_id": "d1", "page_number": 1, "text": "Deep neural networks for satellite cyclone intensity prediction.", "token_count": 9},
        {"chunk_id": "c2", "doc_id": "d1", "page_number": 2, "text": "Microbial fuel cell power density telemetry via ESP32 ADC.", "token_count": 9},
        {"chunk_id": "c3", "doc_id": "d2", "page_number": 1, "text": "Network intrusion detection using random forests and packet logs.", "token_count": 9}
    ]
    store.add_chunks(chunks)
    assert len(store.chunks) == 3

    # Query matching cyclone
    matches = store.search("cyclone satellite prediction", top_k=2)
    assert len(matches) > 0
    assert matches[0]["chunk_id"] == "c1"
    assert matches[0]["score"] > 0.1

    # Query matching intrusion
    intrusion_matches = store.search("intrusion cyber attack", top_k=1)
    assert intrusion_matches[0]["chunk_id"] == "c3"

def test_citations_generator():
    meta = {
        "doc_id": "paper123",
        "title": "Edge Intelligence in Bio-Electrochemical Systems",
        "authors": ["Prince Kumar", "Research Collaborator"],
        "year": 2026,
        "total_pages": 8
    }
    citations = CitationGenerator.generate_all_formats(meta)
    assert "Kumar" in citations["apa"]
    assert "2026" in citations["apa"]
    assert "@article" in citations["bibtex"]
    assert "Kumar" in citations["ieee"]

def test_rag_engine():
    store = VectorStore(dimension=64)
    chunks = [
        {
            "chunk_id": "c1",
            "doc_id": "paper_rag",
            "page_number": 3,
            "text": "The proposed architecture achieved a 94.2% precision on benchmark datasets. In conclusion, the system outperforms legacy methods.",
            "token_count": 18
        }
    ]
    store.add_chunks(chunks)
    engine = RAGEngine(store)

    # QA
    response = engine.answer_question("What precision was achieved?", doc_ids=["paper_rag"])
    assert "answer" in response
    assert len(response["citations"]) == 1
    assert response["citations"][0]["page_number"] == 3

    # Summary
    meta = {
        "title": "Benchmark Paper",
        "total_pages": 4
    }
    summary = engine.generate_summary("paper_rag", meta)
    assert "summary" in summary
    assert len(summary["key_findings"]) > 0
