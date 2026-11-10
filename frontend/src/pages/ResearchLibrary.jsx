import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  Trash2, 
  MessageSquare, 
  Quote, 
  FileText, 
  Sparkles, 
  Calendar, 
  Layers, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function ResearchLibrary({ documents, onRefresh, setActivePage, onSelectDocumentForChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSummaryDoc, setSelectedSummaryDoc] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = documents.filter((d) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = d.title?.toLowerCase().includes(term);
    const fileMatch = d.filename?.toLowerCase().includes(term);
    const authorMatch = d.authors?.some(a => a.toLowerCase().includes(term));
    return titleMatch || fileMatch || authorMatch;
  });

  const handleOpenSummary = async (doc) => {
    setSelectedSummaryDoc(doc);
    setLoadingSummary(true);
    try {
      const res = await api.summarize(doc.doc_id);
      setSummaryData(res);
    } catch (err) {
      setSummaryData({ error: err.message });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to remove this paper and purge its vector index?")) return;
    setDeletingId(docId);
    try {
      await api.deleteDocument(docId);
      await onRefresh();
    } catch (err) {
      alert("Error deleting document: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-brand-purple" />
            <span>Research Library</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse and inspect all indexed research papers and vector embeddings.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search papers, authors..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center border border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold font-mono text-slate-300">
            {searchTerm ? "No documents match your search" : "Your Library is Empty"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm ? "Try searching with a different term or clear the filter." : "Upload scientific PDFs to begin building your research corpus."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setActivePage('upload')}
              className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-mono font-medium"
            >
              Upload Paper
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <div
              key={doc.doc_id}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between group glass-card-hover"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{doc.year || 2026}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-brand-violet">
                    {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold font-mono text-white mb-2 line-clamp-2 group-hover:text-brand-cyan transition-colors">
                  {doc.title || doc.filename}
                </h3>

                {/* Authors */}
                <p className="text-xs text-slate-400 font-sans mb-4 line-clamp-1">
                  {doc.authors?.length ? doc.authors.join(', ') : 'Unknown Researcher'}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-dark-900 border border-slate-800">
                    <Layers className="w-3 h-3 text-brand-purple" />
                    <span>{doc.total_chunks} Chunks</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800">
                    {(doc.file_size_bytes / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectDocumentForChat(doc.doc_id);
                      setActivePage('chat');
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-cyan hover:scale-105 transition-all"
                    title="Ask AI questions about this paper"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenSummary(doc)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-violet hover:scale-105 transition-all"
                    title="Generate AI summary"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectDocumentForChat(doc.doc_id);
                      setActivePage('citations');
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:scale-105 transition-all"
                    title="View citations"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(doc.doc_id)}
                  disabled={deletingId === doc.doc_id}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Delete paper"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Modal */}
      {selectedSummaryDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 border border-slate-700 bg-dark-900 shadow-2xl relative">
            <button
              onClick={() => {
                setSelectedSummaryDoc(null);
                setSummaryData(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-purple">
                <Sparkles className="w-4 h-4" />
                <span>AI Research Synthesis</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white">
                {selectedSummaryDoc.title || selectedSummaryDoc.filename}
              </h3>

              {loadingSummary ? (
                <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Synthesizing paper methodology and outcomes...</p>
                </div>
              ) : summaryData?.error ? (
                <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-xs font-mono text-red-300">
                  {summaryData.error}
                </div>
              ) : summaryData ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
                    <h4 className="font-mono font-bold text-slate-200">Executive Overview:</h4>
                    <p className="text-slate-300 leading-relaxed font-sans">{summaryData.summary}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
                    <h4 className="font-mono font-bold text-slate-200">Methodology:</h4>
                    <p className="text-slate-300 leading-relaxed font-sans">{summaryData.methodology}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
                    <h4 className="font-mono font-bold text-slate-200">Key Findings:</h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {summaryData.key_findings?.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {summaryData.limitations && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                      <strong className="text-slate-300 block font-mono mb-1">Limitations:</strong>
                      {summaryData.limitations}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
