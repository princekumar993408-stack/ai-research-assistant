import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Trash2, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { api } from '../api';

export default function AIChat({ documents, selectedDocId, setSelectedDocId, offlineMode }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AI Research Assistant. Select your research paper context from the dropdown above and ask any question about methodology, experimental benchmarks, or conclusions. All answers are grounded directly in your uploaded papers with exact page citations.',
      citations: [],
      confidence: 1.0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCitationIdx, setExpandedCitationIdx] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: inputQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQ = inputQuestion;
    setInputQuestion('');
    setLoading(true);

    try {
      const targetDocs = selectedDocId ? [selectedDocId] : null;
      const res = await api.askQuestion(currentQ, targetDocs, 4, offlineMode);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.answer,
        citations: res.citations || [],
        confidence: res.confidence_score || 0.85,
        retrievalMode: res.retrieval_mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error retrieving answer: ${err.message}. Please ensure the backend is running and papers are indexed.`,
        citations: [],
        confidence: 0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: 'Conversation history cleared. Ready for your next research inquiry.',
        citations: [],
        confidence: 1.0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-dark-950">
      
      {/* Context Control Bar */}
      <div className="p-4 border-b border-slate-800 bg-dark-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400">Context Scope:</label>
          <select
            value={selectedDocId || ''}
            onChange={(e) => setSelectedDocId(e.target.value || null)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-brand-purple"
          >
            <option value="">All Uploaded Papers ({documents.length})</option>
            {documents.map((d) => (
              <option key={d.doc_id} value={d.doc_id}>
                {d.title?.slice(0, 45) || d.filename}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local RAG Mode</span>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 px-1">
                <span>{isUser ? 'You' : 'AI Assistant'}</span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed font-sans ${
                  isUser
                    ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-tr-none shadow-md shadow-brand-purple/20'
                    : 'glass-card border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Evidence Citations Drawer */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-brand-cyan flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Source Citations ({msg.citations.length}):</span>
                      </span>
                      {msg.confidence !== undefined && (
                        <span className="text-slate-400">
                          Confidence: <strong className="text-emerald-400">{(msg.confidence * 100).toFixed(0)}%</strong>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {msg.citations.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-xs font-mono space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="text-brand-violet font-semibold">
                              [Source {c.source_index} &bull; Page {c.page_number}]
                            </span>
                            <span>Score: {c.relevance_score}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-sans italic">
                            "{c.excerpt}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 p-4 rounded-xl bg-dark-900 w-fit border border-slate-800 animate-pulse">
            <div className="w-4 h-4 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
            <span>Scanning high-dimensional vector space &amp; synthesizing citations...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-dark-900/80 backdrop-blur-md">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask a technical research question (e.g. 'What power density was achieved and at what resistance?')..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>

    </div>
  );
}
