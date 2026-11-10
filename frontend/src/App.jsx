import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ResearchLibrary from './pages/ResearchLibrary';
import PDFUpload from './pages/PDFUpload';
import AIChat from './pages/AIChat';
import PaperComparison from './pages/PaperComparison';
import CitationGenerator from './pages/CitationGenerator';
import ResearchHistory from './pages/ResearchHistory';
import Settings from './pages/Settings';
import { api } from './api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [offlineMode, setOfflineMode] = useState(true);
  const [backendStatus, setBackendStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Poll backend health and fetch documents
  const loadInitialData = async () => {
    try {
      const health = await api.getHealth();
      setBackendStatus(health);
    } catch {
      setBackendStatus({ status: 'disconnected' });
    }

    try {
      const docs = await api.listDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !selectedDocId) {
        setSelectedDocId(docs[0].doc_id);
      }
    } catch {
      // If backend is fresh/empty, documents remain empty
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Research Dashboard';
      case 'library': return 'Research Library';
      case 'upload': return 'Document Ingestion';
      case 'chat': return 'AI Research Chat';
      case 'comparison': return 'Paper Comparison Matrix';
      case 'citations': return 'Citation & Notes Exporter';
      case 'history': return 'Activity History';
      case 'settings': return 'System Settings';
      default: return 'AI Research Assistant';
    }
  };

  return (
    <div className="flex h-screen bg-dark-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        offlineMode={offlineMode}
        docCount={documents.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          title={getPageTitle()}
          backendStatus={backendStatus}
          onRefresh={handleRefresh}
          setActivePage={setActivePage}
          docCount={documents.length}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'dashboard' && (
            <Dashboard
              documents={documents}
              setActivePage={setActivePage}
              onSelectDocumentForChat={(id) => setSelectedDocId(id)}
            />
          )}

          {activePage === 'library' && (
            <ResearchLibrary
              documents={documents}
              onRefresh={handleRefresh}
              setActivePage={setActivePage}
              onSelectDocumentForChat={(id) => setSelectedDocId(id)}
            />
          )}

          {activePage === 'upload' && (
            <PDFUpload
              onUploadSuccess={handleRefresh}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'chat' && (
            <AIChat
              documents={documents}
              selectedDocId={selectedDocId}
              setSelectedDocId={setSelectedDocId}
              offlineMode={offlineMode}
            />
          )}

          {activePage === 'comparison' && (
            <PaperComparison
              documents={documents}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'citations' && (
            <CitationGenerator
              documents={documents}
              selectedDocId={selectedDocId}
              setSelectedDocId={setSelectedDocId}
            />
          )}

          {activePage === 'history' && (
            <ResearchHistory
              documents={documents}
            />
          )}

          {activePage === 'settings' && (
            <Settings
              offlineMode={offlineMode}
              setOfflineMode={setOfflineMode}
              backendStatus={backendStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}
