import React from 'react';
import { Settings as SettingsIcon, Shield, Server, Database, Sliders, CheckCircle2 } from 'lucide-react';

export default function Settings({ offlineMode, setOfflineMode, backendStatus }) {
  const isHealthy = backendStatus?.status === 'healthy' || backendStatus?.status === 'operational';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-purple" />
          <span>System Settings &amp; Diagnostics</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configure RAG retrieval parameters, vector space dimensions, and local privacy execution.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Backend Connectivity Status */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-cyan" />
            <span>FastAPI Backend Service</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Service Endpoint</span>
              <div className="text-white font-bold">http://127.0.0.1:8000</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Status</span>
              <div className={`font-bold flex items-center gap-2 ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{isHealthy ? 'Operational & Ready' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Privacy Mode Toggle */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Zero-Network Offline Mode</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                When enabled, embeddings, cosine vector similarity, and answer extraction run 100% locally on your machine with zero external network traffic.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* RAG Engine Parameters */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-purple" />
            <span>RAG Hyperparameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">Chunk Window</span>
              <span className="text-white font-bold text-sm">300 – 400 words</span>
              <p className="text-[10px] text-slate-500 mt-1">Preserves paragraph context</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">Overlap Window</span>
              <span className="text-white font-bold text-sm">50 words</span>
              <p className="text-[10px] text-slate-500 mt-1">Sliding semantic overlap</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">Vector Metric</span>
              <span className="text-brand-cyan font-bold text-sm">Cosine Similarity</span>
              <p className="text-[10px] text-slate-500 mt-1">Normalized inner product</p>
            </div>
          </div>
        </div>

        {/* Developer Attribution Card */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            <strong className="text-white block">AI Research Assistant v1.0.0</strong>
            <span>Built by Prince Kumar &bull; Jain University</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Build</span>
          </div>
        </div>

      </div>

    </div>
  );
}
