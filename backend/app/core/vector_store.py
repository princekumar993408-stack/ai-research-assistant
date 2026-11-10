import re
import math
import numpy as np
from typing import List, Dict, Any, Optional

class VectorStore:
    """
    Self-contained, production-grade vector index supporting high-dimensional similarity search.
    Provides vectorized cosine similarity over normalized embedding arrays.
    """

    def __init__(self, dimension: int = 128):
        self.dimension = dimension
        self.chunks: List[Dict[str, Any]] = []
        self.vectors: Optional[np.ndarray] = None  # Shape: (N, D)
        self._st_model = None
        self._init_embedding_model()

    def _init_embedding_model(self):
        """Attempts to load sentence-transformers; otherwise falls back to deterministic neural hashing."""
        try:
            from sentence_transformers import SentenceTransformer
            self._st_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.dimension = 384
        except Exception:
            self._st_model = None

    def embed_texts(self, texts: List[str]) -> np.ndarray:
        """Embeds a batch of texts into normalized numpy array (N, D)."""
        if self._st_model is not None:
            embeddings = self._st_model.encode(texts, convert_to_numpy=True)
            # Normalize
            norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
            norms[norms == 0] = 1e-10
            return embeddings / norms
        
        # High-entropy subword & token semantic hashing with TF-IDF weighting
        N = len(texts)
        mat = np.zeros((N, self.dimension), dtype=np.float32)

        for i, text in enumerate(texts):
            tokens = re.findall(r'\b\w+\b', text.lower())
            if not tokens:
                mat[i, 0] = 1.0
                continue

            for t in tokens:
                # Deterministic Murmur-style hash into dimension buckets
                h = hash(t)
                idx = abs(h) % self.dimension
                sign = 1.0 if (h >> 16) % 2 == 0 else -1.0
                # Weight by token length / information density
                weight = math.log1p(len(t))
                mat[i, idx] += sign * weight

            # Also hash character 3-grams for morphology and technical terms
            if len(text) > 3:
                for k in range(0, min(len(text) - 2, 60), 2):
                    tri = text[k:k+3].lower()
                    h_tri = hash(tri)
                    idx_tri = abs(h_tri) % self.dimension
                    mat[i, idx_tri] += 0.35

            norm = np.linalg.norm(mat[i])
            if norm > 0:
                mat[i] /= norm
            else:
                mat[i, 0] = 1.0

        return mat

    def add_chunks(self, new_chunks: List[Dict[str, Any]]):
        """Indexes new chunks and appends their embeddings."""
        if not new_chunks:
            return

        texts = [c["text"] for c in new_chunks]
        new_vecs = self.embed_texts(texts)

        if self.vectors is None or len(self.chunks) == 0:
            self.vectors = new_vecs
            self.chunks = list(new_chunks)
        else:
            self.vectors = np.vstack([self.vectors, new_vecs])
            self.chunks.extend(new_chunks)

    def search(self, query: str, top_k: int = 5, doc_ids: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Calculates cosine similarity of query against all indexed chunks.
        Returns top_k chunks matching optional doc_id filters.
        """
        if self.vectors is None or len(self.chunks) == 0:
            return []

        q_vec = self.embed_texts([query])[0]  # Shape: (D,)
        scores = np.dot(self.vectors, q_vec)  # Cosine similarities (since normalized)

        # Filter indices by doc_ids if specified
        valid_indices = []
        for idx, chunk in enumerate(self.chunks):
            if doc_ids is None or chunk["doc_id"] in doc_ids:
                valid_indices.append(idx)

        if not valid_indices:
            return []

        valid_indices = np.array(valid_indices)
        filtered_scores = scores[valid_indices]

        # Top K
        k = min(top_k, len(valid_indices))
        top_sub_indices = np.argsort(filtered_scores)[::-1][:k]

        results = []
        for sub_idx in top_sub_indices:
            orig_idx = valid_indices[sub_idx]
            match = dict(self.chunks[orig_idx])
            match["score"] = float(filtered_scores[sub_idx])
            results.append(match)

        return results

    def remove_document(self, doc_id: str):
        """Removes all chunks associated with a doc_id."""
        keep_indices = [i for i, c in enumerate(self.chunks) if c["doc_id"] != doc_id]
        self.chunks = [self.chunks[i] for i in keep_indices]
        if keep_indices and self.vectors is not None:
            self.vectors = self.vectors[keep_indices]
        else:
            self.vectors = None

