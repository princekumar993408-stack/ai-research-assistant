import React, { useState } from 'react';
import { GitCompare, CheckSquare, Square, Sparkles, Layers, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function PaperComparison({ documents, setActivePage }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      setError("Please select at least 2 research papers to generate a comparative analysis.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.comparePapers(selectedIds);
      setComparisonResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-brand-blue" />
          <span>Cross-Paper Comparison Matrix</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Select multiple research papers to analyze differences in problem formulation, algorithmic architecture, benchmark datasets, and reported performance.
        </p>
      </div>

      {/* Document Selection Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white">
            Select Papers to Compare ({selectedIds.length} selected)
          </h3>
          <button
            onClick={handleCompare}
            disabled={selectedIds.length < 2 || loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Comparing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Matrix Comparison</span>
              </>
            )}
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-slate-500">
            No papers available. Please upload papers first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((d) => {
              const isSelected = selectedIds.includes(d.doc_id);
              return (
                <div
                  key={d.doc_id}
                  onClick={() => toggleSelect(d.doc_id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-purple-950/30 border-brand-purple text-white'
                      : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 text-brand-cyan">
                    {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </div>
                  <div className="text-xs font-mono overflow-hidden">
                    <div className="font-bold truncate">{d.title || d.filename}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {d.total_pages} pages &bull; {d.total_chunks} chunks
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs font-mono text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Matrix Display */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Executive Synthesis */}
          <div className="glass-card p-6 rounded-2xl border border-brand-purple/40 bg-purple-950/20 space-y-2">
            <h3 className="text-xs font-bold font-mono text-brand-cyan uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Comparative Synthesis</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {comparisonResult.synthesis}
            </p>
          </div>

          {/* Side-by-side Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                <tr>
                  <th className="p-4 w-48 shrink-0">Analysis Dimension</th>
                  {comparisonResult.documents_compared.map((dId) => {
                    const doc = documents.find(x => x.doc_id === dId);
                    return (
                      <th key={dId} className="p-4 min-w-[240px]">
                        <span className="text-brand-cyan">{doc?.title || dId}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonResult.comparison_matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="p-4 font-bold text-white bg-dark-900/40">
                      {row.dimension}
                    </td>
                    {comparisonResult.documents_compared.map((dId) => (
                      <td key={dId} className="p-4 text-slate-300 font-sans leading-relaxed">
                        {row.comparisons[dId]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
