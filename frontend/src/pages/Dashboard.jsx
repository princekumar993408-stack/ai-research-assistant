import React from 'react';
import { 
  FileText, 
  Layers, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  GitCompare, 
  Quote, 
  CheckCircle2, 
  HardDrive 
} from 'lucide-react';

export default function Dashboard({ documents, setActivePage, onSelectDocumentForChat }) {
  const totalPages = documents.reduce((sum, d) => sum + (d.total_pages || 0), 0);
  const totalChunks = documents.reduce((sum, d) => sum + (d.total_chunks || 0), 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-brand-purple/20 text-brand-violet border border-brand-purple/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Local Scientific RAG Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
            Scientific Research Assistant &amp; Synthesis Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Ingest research papers (PDF), extract structural text preserving semantic boundaries, perform high-dimensional vector search, query claims with verifiable page citations, and run comparisons without leaking sensitive research notes.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage('upload')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium hover:scale-[1.02] transition-transform"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Ingest New Document</span>
            </button>
            <button
              onClick={() => setActivePage('chat')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-medium"
            >
              <MessageSquare className="w-4 h-4 text-brand-cyan" />
              <span>Open Research Chat</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 blur-[100px] pointer-events-none rounded-full" />
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Research Papers</span>
            <FileText className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{documents.length}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Indexed in local library</div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Document Pages</span>
            <Layers className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalPages}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Parsed &amp; normalized</div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Vector Chunks</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalChunks}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">High-dimensional embeddings</div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Execution Mode</span>
            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">Offline RAG</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Zero external API latency</div>
        </div>
      </div>

      {/* Quick Action Feature Grid */}
      <div>
        <h2 className="text-sm uppercase font-mono tracking-wider text-slate-400 mb-4">
          Core Workflows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setActivePage('chat')}
            className="glass-card p-6 rounded-2xl glass-card-hover cursor-pointer border border-slate-800 group"
          >
            <div className="p-3 rounded-xl bg-purple-950/60 text-brand-violet w-fit mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white mb-1 flex items-center justify-between">
              <span>Evidence-Grounded Chat</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask targeted questions across your papers with exact page citations and confidence scores.
            </p>
          </div>

          <div
            onClick={() => setActivePage('comparison')}
            className="glass-card p-6 rounded-2xl glass-card-hover cursor-pointer border border-slate-800 group"
          >
            <div className="p-3 rounded-xl bg-blue-950/60 text-brand-blue w-fit mb-4 group-hover:scale-105 transition-transform">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white mb-1 flex items-center justify-between">
              <span>Cross-Paper Comparison</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate side-by-side matrices comparing methodology, benchmarks, datasets, and outcomes.
            </p>
          </div>

          <div
            onClick={() => setActivePage('citations')}
            className="glass-card p-6 rounded-2xl glass-card-hover cursor-pointer border border-slate-800 group"
          >
            <div className="p-3 rounded-xl bg-emerald-950/60 text-emerald-400 w-fit mb-4 group-hover:scale-105 transition-transform">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white mb-1 flex items-center justify-between">
              <span>Citation &amp; Notes Exporter</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly generate APA, IEEE, and BibTeX citations or export full Markdown research notes.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Indexed Papers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase font-mono tracking-wider text-slate-400">
            Recent Research Papers
          </h2>
          <button
            onClick={() => setActivePage('library')}
            className="text-xs font-mono text-brand-cyan hover:underline"
          >
            View All ({documents.length}) &rarr;
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center border border-slate-800 space-y-3">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-mono text-slate-300">No Research Papers Uploaded Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upload your first scientific paper (PDF) to build your semantic vector index and begin querying.
            </p>
            <button
              onClick={() => setActivePage('upload')}
              className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-mono font-medium"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="p-4">Title / Filename</th>
                  <th className="p-4 hidden sm:table-cell">Authors</th>
                  <th className="p-4">Pages</th>
                  <th className="p-4">Chunks</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.doc_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div className="truncate max-w-xs sm:max-w-md">{doc.title || doc.filename}</div>
                      <div className="text-[10px] text-slate-500">{doc.filename}</div>
                    </td>
                    <td className="p-4 text-slate-300 hidden sm:table-cell">
                      {doc.authors?.slice(0, 2).join(', ') || 'Researcher'}
                    </td>
                    <td className="p-4 text-slate-300">{doc.total_pages}</td>
                    <td className="p-4 text-brand-cyan">{doc.total_chunks}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          onSelectDocumentForChat(doc.doc_id);
                          setActivePage('chat');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-cyan text-[11px]"
                      >
                        Chat &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
