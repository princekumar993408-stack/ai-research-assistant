import sys
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.pdf_parser import PDFParser
from app.core.chunker import SemanticChunker
from app.core.vector_store import VectorStore
from app.core.rag_engine import RAGEngine
from app.core.citations import CitationGenerator

def run_e2e_verification():
    sample_paper = backend_dir.parent / "data" / "sample_papers" / "sample_iot_paper.txt"

    print("=== STEP 1: PARSING DOCUMENT ===")
    pages, meta = PDFParser.extract_text_and_metadata(sample_paper)
    print(f"✓ Extracted {len(pages)} pages.")
    print(f"✓ Inferred Title: {meta['title']}")
    print(f"✓ Authors: {', '.join(meta['authors'])}")

    print("\n=== STEP 2: SEMANTIC CHUNKING ===")
    chunker = SemanticChunker(chunk_size_words=100, overlap_words=20)
    chunks = chunker.chunk_document("doc_sample", pages)
    print(f"✓ Generated {len(chunks)} contextual chunks with sliding overlap.")

    print("\n=== STEP 3: HIGH-DIMENSIONAL VECTOR INDEXING ===")
    store = VectorStore(dimension=64)
    store.add_chunks(chunks)
    print(f"✓ Indexed {len(store.chunks)} chunks in vector space.")

    print("\n=== STEP 4: VECTOR SIMILARITY SEARCH ===")
    matches = store.search("peak power density shunt resistance", top_k=2)
    print(f"✓ Retrieved {len(matches)} matching chunks:")
    for m in matches:
        print(f"  - [Score: {m['score']:.4f}] Page {m['page_number']}: {m['text'][:100]}...")

    print("\n=== STEP 5: EVIDENCE-GROUNDED QUESTION ANSWERING ===")
    engine = RAGEngine(store)
    qa = engine.answer_question("What power density was achieved and at what resistance?", doc_ids=["doc_sample"])
    print(f"✓ Answer:\n{qa['answer']}")
    print(f"✓ Citations: {len(qa['citations'])} page references attached.")

    print("\n=== STEP 6: EXECUTIVE SUMMARY & CITATIONS ===")
    summary = engine.generate_summary("doc_sample", meta)
    print(f"✓ Summary: {summary['summary']}")
    print(f"✓ Key Findings: {len(summary['key_findings'])} items identified.")

    citations = CitationGenerator.generate_all_formats(meta)
    print(f"✓ BibTeX Generated:\n{citations['bibtex']}")

    print("\n==============================================")
    print("✅ COMPLETE END-TO-END VERIFICATION SUCCESSFUL")
    print("==============================================")

if __name__ == "__main__":
    run_e2e_verification()

