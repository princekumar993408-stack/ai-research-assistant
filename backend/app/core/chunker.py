import re
from typing import List, Dict, Any

class SemanticChunker:
    """Splits academic document pages into overlapping semantic chunks."""

    def __init__(self, chunk_size_words: int = 300, overlap_words: int = 50):
        self.chunk_size = chunk_size_words
        self.overlap = overlap_words

    def chunk_document(self, doc_id: str, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Takes page list and produces structured chunks with metadata.
        Each chunk contains:
          - chunk_id: f"{doc_id}_p{page}_{chunk_idx}"
          - doc_id: str
          - page_number: int
          - text: str
          - token_count: int
        """
        all_chunks = []
        chunk_counter = 0

        for page in pages:
            page_num = page["page_number"]
            page_text = page["text"]
            
            # Split page text into sentences/paragraphs
            paragraphs = [p.strip() for p in page_text.split("\n\n") if p.strip()]
            
            current_chunk_words = []
            
            for para in paragraphs:
                words = para.split()
                if not words:
                    continue

                if len(current_chunk_words) + len(words) <= self.chunk_size:
                    current_chunk_words.extend(words)
                else:
                    # Flush current chunk
                    if current_chunk_words:
                        chunk_str = " ".join(current_chunk_words)
                        all_chunks.append({
                            "chunk_id": f"{doc_id}_p{page_num}_{chunk_counter}",
                            "doc_id": doc_id,
                            "page_number": page_num,
                            "text": chunk_str,
                            "token_count": len(current_chunk_words)
                        })
                        chunk_counter += 1
                        
                        # Retain overlap words
                        overlap_tail = current_chunk_words[-self.overlap:] if len(current_chunk_words) > self.overlap else []
                        current_chunk_words = overlap_tail + words
                    else:
                        current_chunk_words = words

            # Flush remaining words for the page
            if current_chunk_words:
                chunk_str = " ".join(current_chunk_words)
                all_chunks.append({
                    "chunk_id": f"{doc_id}_p{page_num}_{chunk_counter}",
                    "doc_id": doc_id,
                    "page_number": page_num,
                    "text": chunk_str,
                    "token_count": len(current_chunk_words)
                })
                chunk_counter += 1

        return all_chunks

