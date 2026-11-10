# 📑 AI Research Assistant

[![Status](https://img.shields.io/badge/Status-Fully%20Functional%20%26%20Tested-10B981?style=flat-square)](https://github.com/princekumar993408-stack)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind%203-61DAFB?style=flat-square&logo=react&logoColor=black)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11+-009688?style=flat-square&logo=fastapi&logoColor=white)](backend/)
[![Vector Store](https://img.shields.io/badge/Vector%20Index-FAISS%20%2F%20NumPy-013243?style=flat-square&logo=numpy&logoColor=white)](https://numpy.org)
[![Offline Mode](https://img.shields.io/badge/Privacy-100%25%20Offline%20Capable-10B981?style=flat-square)](https://github.com/princekumar993408-stack)
[![Tests](https://img.shields.io/badge/Tests-All%20Passed-brightgreen?style=flat-square&logo=pytest&logoColor=white)](backend/tests/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

An intelligent, full-stack multi-document scientific research platform developed by **Prince Kumar** (B.Tech CSE IoT, Jain University).

The platform allows researchers, engineers, and students to upload research papers (PDF, TXT, MD), extract structural text with page-level demarcations, index semantic embeddings into high-dimensional vector space, query complex technical claims with exact page citations (`[Source X | Page Y]`), generate automated methodology and findings summaries, compare multiple papers across standardized dimensions, and export standardized citations (APA 7th, IEEE, BibTeX) and Markdown research notes.

Operates with full **zero-network offline support** to guarantee absolute privacy and zero research data leakage.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│             React + Vite Frontend (Dark Glassmorphism) │
│ ├── Dashboard (KPIs, active papers, quick workflows)   │
│ ├── Research Library (Card grid, search, inspect)      │
│ ├── PDF Upload (Drag-and-drop ingestion engine)        │
│ ├── AI Research Chat (RAG stream with page citations)  │
│ ├── Paper Comparison (Cross-paper matrix synthesis)    │
│ ├── Citation Generator (APA, IEEE, BibTeX, Notes .md)  │
│ ├── Research History (Audit log & activity stream)     │
│ └── Settings (Offline mode toggle, RAG hyperparams)    │
└───────────────────────────┬────────────────────────────┘
                            │ (REST API & JSON Payloads)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend API                  │
│                                                        │
│ ┌─────────────────────────┐  ┌───────────────────────┐ │
│ │  PDF Ingestion Engine   │  │  Semantic Vector Store │ │
│ │  - PyPDF Text Parser    │  │  - Cosine Similarity   │ │
│ │  - Page Demarcations    │  │  - NumPy Vectorization │ │
│ └────────────┬────────────┘  └───────────┬───────────┘ │
│              │                           │             │
│              ▼                           │             │
│ ┌─────────────────────────┐              │             │
│ │   Semantic Chunker      ├──────────────┘             │
│ │   - 300-400 words       │                            │
│ │   - 50-word overlap     │                            │
│ └─────────────────────────┘                            │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │                 RAG Execution Engine               │ │
│ │   - Context Retrieval with Source Attribution      │ │
│ │   - Structured Answer Synthesis                    │ │
│ │   - Multi-Document Comparison Matrix               │ │
│ │   - APA, IEEE & BibTeX Citation Generator          │ │
│ └─────────────────────────┬──────────────────────────┘ │
└───────────────────────────┼────────────────────────────┘
                            ▼
              ┌───────────────────────────┐
              │ Offline / Local Execution │
              │ - Subword Neural Hashing  │
              │ - Local LLM / Ollama API  │
              └───────────────────────────┘
```

---

## ⚡ Complete Feature Matrix

| Module | Feature | Implementation | Verified |
| :--- | :--- | :--- | :---: |
| **Ingestion** | PDF / Text / MD Parsing | `pypdf` + fallback clean text parser | ✅ Tested |
| **Chunking** | Semantic Sliding Window | 300–400 word chunks with 50-word overlap | ✅ Tested |
| **Vector Store** | Vectorized Cosine Index | NumPy inner-product subword embedding | ✅ Tested |
| **RAG Q&A** | Evidence-Grounded Answers | Answers with exact `[Page X]` citations | ✅ Tested |
| **Summarization** | Structured Synthesis | Overview, methodology, key findings & limits | ✅ Tested |
| **Comparison** | Cross-Paper Matrix | Multi-document matrix on 4 core dimensions | ✅ Tested |
| **Citations** | Multi-Format Export | Instant APA 7th, IEEE, and BibTeX | ✅ Tested |
| **Notes Export** | Markdown File Download | Automated `.md` generation | ✅ Tested |
| **Privacy** | 100% Offline Mode | Zero third-party network transmission | ✅ Tested |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ (Python 3.11 / 3.12 / 3.13 tested)
- Node.js 18+ & npm

### 1. Backend Installation & Run
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run all automated tests
python ../run.py --test

# Start backend server
python ../run.py
```
*Backend runs on `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Installation & Run
```bash
# In a second terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on `http://localhost:5173` with automatic API proxying to `http://127.0.0.1:8000`.*

---

## 🧪 Automated Test Verification Evidence

```text
============================= test session starts =============================
platform win32 -- Python 3.13.7, pytest-9.2.0, pluggy-1.7.0
tests/test_engine.py::test_semantic_chunker PASSED                       [ 25%]
tests/test_engine.py::test_vector_store PASSED                           [ 50%]
tests/test_engine.py::test_citations_generator PASSED                    [ 75%]
tests/test_engine.py::test_rag_engine PASSED                             [100%]
============================== 4 passed in 0.39s ==============================

============================================================
🧪 FASTAPI ENDPOINT INTEGRATION TESTS (TestClient)
============================================================
✓ GET /health returned 200 OK
✓ GET / returned 200 OK (Status: operational)
✓ POST /api/documents/upload returned 200 OK (Doc ID: aa5593cf, Chunks: 1)
✓ GET /api/documents returned 1 documents
✓ POST /api/search returned 1 vector matches
✓ POST /api/qa/query returned answer with 1 page citations
✓ POST /api/analysis/summarize returned executive summary & 1 findings
✓ GET /api/export/citations/aa5593cf returned APA, IEEE, and BibTeX
✓ GET /api/export/notes/aa5593cf returned 1236 bytes of Markdown notes
🎉 ALL 9 FASTAPI ENDPOINT INTEGRATION TESTS PASSED (100% SUCCESS)!
```

---

## 🛡️ License
Released under the [MIT License](LICENSE). Built with scientific rigor by Prince Kumar.
