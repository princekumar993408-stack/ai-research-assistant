import React from 'react';
import { 
  LayoutDashboard, 
  Library, 
  UploadCloud, 
  MessageSquareText, 
  GitCompare, 
  Quote, 
  History, 
  Settings, 
  ShieldCheck, 
  Zap,
  Cpu
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, offlineMode, docCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'Research Library', icon: Library, badge: docCount },
    { id: 'upload', label: 'PDF Upload', icon: UploadCloud },
    { id: 'chat', label: 'AI Research Chat', icon: MessageSquareText },
    { id: 'comparison', label: 'Paper Comparison', icon: GitCompare },
    { id: 'citations', label: 'Citation Generator', icon: Quote },
    { id: 'history', label: 'Research History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-dark-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-md shadow-brand-purple/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-base text-white tracking-tight">
              AI Research<span className="text-brand-cyan">.ai</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Scientific RAG Engine
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 text-brand-cyan border border-brand-purple/40 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-purple/30 text-brand-violet border border-brand-purple/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline Privacy</span>
            </span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-tight">
            Local vector space indexing. No external data leaks.
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-center">
          Prince Kumar &bull; B.Tech CSE (IoT)
        </div>
      </div>
    </aside>
  );
}
