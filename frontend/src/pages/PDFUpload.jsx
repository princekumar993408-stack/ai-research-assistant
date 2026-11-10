import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { api } from '../api';

export default function PDFUpload({ onUploadSuccess, setActivePage }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const res = await api.uploadDocument(file);
      setUploadResult(res);
      onUploadSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSamplePaper = async () => {
    setUploading(true);
    setError(null);
    try {
      // Create a mock File object from the bundled sample paper content
      const sampleContent = `Title: Edge Intelligence and Telemetry Architectures for Bio-Electrochemical Systems
Authors: Prince Kumar, Systems Research Lab
Year: 2026
Abstract:
Microbial fuel cells (MFCs) represent an emerging bio-electrochemical paradigm for renewable energy generation and simultaneous wastewater treatment. However, bio-potential fluctuations caused by microbial community dynamics require continuous, high-precision telemetry. This research presents an edge-computing architecture combining the ESP32 microcontroller with a 16-bit analog-to-digital converter (ADS1115) and MQTT telemetry.

Page 1
Introduction:
Microbial fuel cells convert biochemical energy from organic substrates directly into electrical power via bacterial metabolic reactions. Real-time telemetry is critical because traditional manual multimeter sampling fails to capture rapid bio-potential transients. The proposed IoT architecture utilizes an ESP32 microcontroller communicating with precision shunt resistors to compute power density in micro-watts per square centimeter.

Page 2
Methodology:
The experimental testbed incorporates an H-type dual-chamber microbial fuel cell with carbon cloth electrodes. Voltage drop across precision shunt resistors (100 to 1000 Ohms) is digitized at 100 Hz by an ADS1115 ADC. Data packets are serialized into JSON payloads and transmitted via MQTT over local Wi-Fi to a central FastAPI broker. In offline scenarios, the system switches to a Michaelis-Menten kinetic simulation model.

Page 3
Results and Discussion:
The system achieved a 98.4% telemetry transmission reliability over a 30-day continuous testing period. Results show that peak power density reached 412 micro-watts per square centimeter at an optimal external resistance of 470 Ohms. Statistical anomaly detection algorithms successfully flagged sudden bio-film drop events within 2.3 seconds of substrate depletion.

Page 4
Conclusion and Future Work:
In conclusion, the proposed edge intelligence platform enables non-invasive, sub-second telemetry for bio-electrochemical reactors. Future work will investigate on-device TinyML inference directly on the ESP32 to predict substrate replenishment intervals autonomously.`;

      const sampleFile = new File([sampleContent], "sample_iot_paper.txt", { type: "text/plain" });
      const res = await api.uploadDocument(sampleFile);
      setUploadResult(res);
      onUploadSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-brand-purple" />
          <span>Upload Research Paper</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Supported formats: <strong className="text-white">PDF</strong>, <strong className="text-white">TXT</strong>, and <strong className="text-white">MD</strong>. Papers are automatically normalized, chunked, and indexed in high-dimensional vector space.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="glass-card p-10 rounded-2xl border-2 border-dashed border-slate-700 hover:border-brand-purple/60 text-center space-y-4 transition-colors relative"
      >
        <div className="w-16 h-16 rounded-2xl bg-purple-950/50 text-brand-violet flex items-center justify-center mx-auto shadow-inner">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-sm font-bold font-mono text-white mb-1">
            {file ? file.name : "Drag and drop research papers here"}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {file ? `${(file.size / 1024).toFixed(1)} KB selected` : "or click browse to select a file from your computer"}
          </p>
        </div>

        <input
          type="file"
          id="file-upload"
          accept=".pdf,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-3 pt-2">
          <label
            htmlFor="file-upload"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium cursor-pointer transition-colors border border-slate-700"
          >
            Browse Files
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Parsing &amp; Indexing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Ingestion</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Alternative Sample Paper CTA */}
      <div className="p-4 rounded-xl bg-dark-850/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-brand-cyan shrink-0" />
          <div className="text-xs font-mono">
            <span className="text-white block font-bold">Need a paper to test?</span>
            <span className="text-slate-400">Load the pre-packaged MFC IoT scientific paper with 4 pages of methodology and power density metrics.</span>
          </div>
        </div>
        <button
          onClick={handleLoadSamplePaper}
          disabled={uploading}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-brand-cyan text-xs font-mono shrink-0"
        >
          Load Sample Paper
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs font-mono text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Extraction Summary Card */}
      {uploadResult && (
        <div className="glass-card p-6 rounded-2xl border border-emerald-800/80 bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Document Ingested &amp; Vector Index Ready!</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">ID: {uploadResult.doc_id}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Title</div>
              <div className="text-white font-bold truncate">{uploadResult.title}</div>
            </div>
            <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Pages Extracted</div>
              <div className="text-brand-cyan font-bold">{uploadResult.total_pages}</div>
            </div>
            <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Semantic Chunks</div>
              <div className="text-brand-purple font-bold">{uploadResult.total_chunks}</div>
            </div>
            <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Vector Space</div>
              <div className="text-emerald-400 font-bold">Indexed (Cosine)</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => setActivePage('chat')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-mono font-medium"
            >
              <span>Ask Questions in AI Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
