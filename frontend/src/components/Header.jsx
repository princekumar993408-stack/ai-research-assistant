import React from 'react';
import { Activity, Shield, UploadCloud, RefreshCw } from 'lucide-react';

export default function Header({ title, backendStatus, onRefresh, setActivePage, docCount }) {
  const isHealthy = backendStatus?.status === 'healthy' || backendStatus?.status === 'operational';

  return (
    <header className="h-16 border-b border-slate-800 bg-dark-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
          <span>{title}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-300">
            {isHealthy ? 'Backend Connected' : 'Connecting to API'}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Refresh library"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Upload Quick CTA */}
        <button
          onClick={() => setActivePage('upload')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium hover:shadow-md hover:shadow-brand-purple/20 transition-all hover:scale-[1.02]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Paper</span>
        </button>
      </div>
    </header>
  );
}
