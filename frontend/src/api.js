/**
 * AI Research Assistant - Backend API Client
 * Connects directly to the FastAPI backend endpoints.
 */

const API_BASE = '/api';

export const api = {
  // Health & Service Status
  async getHealth() {
    try {
      const res = await fetch('/health');
      return await res.json();
    } catch (err) {
      return { status: 'disconnected', error: err.message };
    }
  },

  // Document Management
  async listDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error(`Failed to list documents: ${res.statusText}`);
    return await res.json();
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status ${res.status}`);
    }
    return await res.json();
  },

  async deleteDocument(docId) {
    const res = await fetch(`${API_BASE}/documents/${docId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return await res.json();
  },

  // Semantic Vector Search
  async search(query, docIds = null, topK = 5) {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, doc_ids: docIds, top_k: topK }),
    });
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  },

  // Evidence-Grounded Q&A (RAG)
  async askQuestion(question, docIds = null, topK = 4, offlineMode = true) {
    const res = await fetch(`${API_BASE}/qa/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        doc_ids: docIds && docIds.length > 0 ? docIds : null,
        top_k: topK,
        offline_mode: offlineMode,
      }),
    });
    if (!res.ok) throw new Error('Question answering query failed');
    return await res.json();
  },

  // Summarization
  async summarize(docId, summaryType = 'comprehensive') {
    const res = await fetch(`${API_BASE}/analysis/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_id: docId, summary_type: summaryType }),
    });
    if (!res.ok) throw new Error('Summarization failed');
    return await res.json();
  },

  // Cross-Paper Comparison
  async comparePapers(docIds) {
    const res = await fetch(`${API_BASE}/analysis/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_ids: docIds }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Paper comparison failed');
    }
    return await res.json();
  },

  // Citation Generation
  async getCitations(docId) {
    const res = await fetch(`${API_BASE}/export/citations/${docId}`);
    if (!res.ok) throw new Error('Failed to fetch citations');
    return await res.json();
  },

  // Research Notes Export
  async exportNotes(docId) {
    const res = await fetch(`${API_BASE}/export/notes/${docId}`);
    if (!res.ok) throw new Error('Failed to export research notes');
    return await res.json();
  },
};
