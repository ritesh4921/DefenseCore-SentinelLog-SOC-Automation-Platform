
import React, { useState } from 'react';
import { cleanLog } from '../services/logParser';

interface LogPreprocessorProps {
  onProcessCleaned: (cleanedContent: string) => void;
}

const LogPreprocessor: React.FC<LogPreprocessorProps> = ({ onProcessCleaned }) => {
  const [rawText, setRawText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [stats, setStats] = useState<{ original: number; cleaned: number } | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleClean = () => {
    if (!rawText.trim()) return;
    setIsCleaning(true);
    setTimeout(() => {
      const cleaned = cleanLog(rawText);
      setCleanedText(cleaned);
      setStats({
        original: rawText.split('\n').length,
        cleaned: cleaned.split('\n').length
      });
      setIsCleaning(false);
    }, 800);
  };

  const handleDownload = () => {
    const blob = new Blob([cleanedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanitized_intel_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3 cyber-font tracking-tight">LOG <span className="text-indigo-400">SCRUBBER</span></h1>
        <p className="text-slate-400">Sanitize proprietary metadata and normalize streams for ingestion.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col h-[600px] group">
          <div className="flex items-center justify-between mb-3 px-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">INPUT_BUFFER</label>
            <span className="text-[9px] font-mono text-slate-600">UTF-8 // RAW_ASCII</span>
          </div>
          <textarea 
            className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-2xl p-6 font-mono text-[11px] text-slate-400 focus:outline-none focus:border-indigo-500/40 transition-all resize-none shadow-inner custom-scrollbar"
            placeholder="[SYSTEM]: Paste raw auth.log fragments here for sanitization..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        <div className="flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">NORMALIZED_OUTPUT</label>
            {stats && <span className="text-[9px] font-mono text-emerald-500">OPTIMIZED: -{Math.round((1 - stats.cleaned / stats.original) * 100)}%</span>}
          </div>
          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-[11px] text-emerald-500/80 overflow-auto whitespace-pre custom-scrollbar relative">
            {isCleaning && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] cyber-font tracking-widest text-indigo-400 animate-pulse">STRIPPING NOISE...</p>
              </div>
            )}
            {cleanedText || <span className="text-slate-700 italic font-mono">[TERMINAL]: Output standby. Awaiting clean command...</span>}
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-6 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <button 
            onClick={handleClean}
            disabled={!rawText || isCleaning}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-3 cyber-font tracking-widest text-xs"
          >
            <i className={`fas ${isCleaning ? 'fa-sync-alt animate-spin' : 'fa-bolt-lightning'}`}></i>
            EXECUTE SCRUB
          </button>

          {stats && (
            <div className="flex gap-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL_RECORDS</span>
                <span className="text-sm font-mono text-white">{stats.original}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">CLEAN_SIGNAL</span>
                <span className="text-sm font-mono text-white">{stats.cleaned}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownload}
            disabled={!cleanedText}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 rounded-xl text-[10px] font-bold border border-white/10 flex items-center gap-2 transition-all cyber-font tracking-widest"
          >
            <i className="fas fa-file-export"></i>
            SAVE TXT
          </button>
          <button 
            onClick={() => onProcessCleaned(cleanedText)}
            disabled={!cleanedText}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-30 text-white rounded-xl text-[10px] font-black flex items-center gap-2 transition-all cyber-font tracking-widest"
          >
            <i className="fas fa-microchip"></i>
            PUSH TO AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogPreprocessor;
