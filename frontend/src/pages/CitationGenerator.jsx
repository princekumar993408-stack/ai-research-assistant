import React, { useState, useEffect } from 'react';
import { Quote, Copy, Check, Download, FileText, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../api';

export default function CitationGenerator({ documents, selectedDocId, setSelectedDocId }) {
  const [citations, setCitations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [exportingNotes, setExportingNotes] = useState(false);

  useEffect(() => {
    if (selectedDocId) {
      loadCitations(selectedDocId);
    } else if (documents.length > 0) {
      setSelectedDocId(documents[0].doc_id);
      loadCitations(documents[0].doc_id);
    }
  }, [selectedDocId, documents]);

  const loadCitations = async (docId) => {
    setLoading(true);
    try {
      const res = await api.getCitations(docId);
      setCitations(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadNotes = async () => {
    if (!selectedDocId) return;
    setExportingNotes(true);
    try {
      const res = await api.exportNotes(selectedDocId);
      const blob = new Blob([res.markdown_content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${res.title.replace(/\W+/g, '_')}_Research_Notes.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export notes: " + err.message);
    } finally {
      setExportingNotes(false);
    }
  };

  const currentDoc = documents.find(d => d.doc_id === selectedDocId);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Quote className="w-6 h-6 text-emerald-400" />
            <span>Citation &amp; Notes Exporter</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Export verified academic citations in APA 7th, IEEE, and BibTeX, or download complete research notes.
          </p>
        </div>

        {/* Paper Selector */}
        <select
          value={selectedDocId || ''}
          onChange={(e) => setSelectedDocId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-brand-purple w-full sm:w-72"
        >
          {documents.map((d) => (
            <option key={d.doc_id} value={d.doc_id}>
              {d.title?.slice(0, 40) || d.filename}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center text-xs font-mono text-slate-400 space-y-2">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Generating standardized bibliographic citations...</p>
        </div>
      ) : citations ? (
        <div className="space-y-6">
          
          {/* APA Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-brand-cyan uppercase tracking-wider">
                APA 7th Edition
              </span>
              <button
                onClick={() => handleCopy('apa', citations.apa)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                {copiedKey === 'apa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'apa' ? 'Copied' : 'Copy APA'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed selection:bg-brand-purple">
              {citations.apa}
            </div>
          </div>

          {/* IEEE Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-brand-violet uppercase tracking-wider">
                IEEE Format
              </span>
              <button
                onClick={() => handleCopy('ieee', citations.ieee)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                {copiedKey === 'ieee' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ieee' ? 'Copied' : 'Copy IEEE'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed selection:bg-brand-purple">
              {citations.ieee}
            </div>
          </div>

          {/* BibTeX Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                BibTeX Entry
              </span>
              <button
                onClick={() => handleCopy('bibtex', citations.bibtex)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                {copiedKey === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bibtex' ? 'Copied' : 'Copy BibTeX'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-dark-900 border border-slate-800 text-xs text-brand-cyan font-mono overflow-x-auto leading-relaxed">
              {citations.bibtex}
            </pre>
          </div>

          {/* Export Full Markdown Notes Button */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-brand-purple/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold font-mono text-white mb-1">
                Download Comprehensive Markdown Research Notes
              </h4>
              <p className="text-xs text-slate-400">
                Includes executive summary, methodology breakdown, key findings, and all bibliographic citations.
              </p>
            </div>
            <button
              onClick={handleDownloadNotes}
              disabled={exportingNotes}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium hover:scale-[1.02] transition-transform shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{exportingNotes ? 'Exporting...' : 'Export Notes (.md)'}</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="glass-card p-12 rounded-2xl text-center text-xs font-mono text-slate-500 border border-slate-800">
          No document selected. Upload or choose a paper above.
        </div>
      )}

    </div>
  );
}
