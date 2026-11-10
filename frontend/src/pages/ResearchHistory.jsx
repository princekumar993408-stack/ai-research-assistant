import React, { useState } from 'react';
import { History, Clock, FileText, MessageSquare, GitCompare, Quote, Trash2 } from 'lucide-react';

export default function ResearchHistory({ documents }) {
  const [historyItems, setHistoryItems] = useState([
    {
      id: 'h1',
      type: 'ingestion',
      title: 'Ingested: sample_iot_paper.txt',
      detail: 'Generated 5 contextual chunks across 4 sections. Vector index updated.',
      timestamp: 'Today at 02:06 PM',
      icon: FileText,
      color: 'text-brand-purple'
    },
    {
      id: 'h2',
      type: 'query',
      title: 'Query: "What power density was achieved and at what resistance?"',
      detail: 'Retrieved 4 chunks with high confidence. Attached page 1 citations.',
      timestamp: 'Today at 02:06 PM',
      icon: MessageSquare,
      color: 'text-brand-cyan'
    },
    {
      id: 'h3',
      type: 'citations',
      title: 'Generated Citations for Edge Intelligence Telemetry',
      detail: 'Exported APA 7th, IEEE, and BibTeX format entries.',
      timestamp: 'Today at 02:06 PM',
      icon: Quote,
      color: 'text-emerald-400'
    }
  ]);

  const handleClear = () => {
    setHistoryItems([]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <History className="w-6 h-6 text-brand-purple" />
            <span>Research Activity History</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Audit trail of all document extractions, RAG queries, comparisons, and citation exports.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center border border-slate-800 text-xs font-mono text-slate-500">
          No recent activity recorded. Run queries or upload papers to generate logs.
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="glass-card p-5 rounded-xl border border-slate-800 flex items-start gap-4"
              >
                <div className={`p-2.5 rounded-xl bg-dark-900 border border-slate-800 ${item.color} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
