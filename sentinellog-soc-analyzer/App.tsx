
import React, { useState } from 'react';
import { parseAuthLog } from './services/logParser';
import { generateIncidentReport } from './services/geminiService';
import { AppStatus, AnalysisResult } from './types';

// Sub-components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FileDropzone from './components/FileDropzone';
import LogPreprocessor from './components/LogPreprocessor';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processContent = async (content: string) => {
    if (!content.trim()) {
      setError("Received empty input stream. Aborting analysis.");
      return;
    }

    setStatus(AppStatus.PARSING);
    setError(null);

    try {
      // Intentional delay to allow UI to breathe and show "Parsing" state smoothly
      await new Promise(r => setTimeout(r, 600));
      
      const parsedData = parseAuthLog(content);
      
      if (parsedData.attackers.length === 0) {
        setResults(parsedData);
        setStatus(AppStatus.COMPLETED);
        return;
      }

      setStatus(AppStatus.ANALYZING);
      const report = await generateIncidentReport(parsedData.attackers);
      
      setResults({
        ...parsedData,
        report
      });
      
      // Another small delay for the transition to "Completed"
      await new Promise(r => setTimeout(r, 400));
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error("SOC App Critical Error:", err);
      setError(err.message || 'A catastrophic error occurred during tactical processing.');
      setStatus(AppStatus.ERROR);
    }
  };

  const processLogFiles = async (files: FileList) => {
    setError(null);
    setStatus(AppStatus.PARSING);
    
    try {
      let combinedContent = "";
      let validFiles = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.log') || file.name.endsWith('.txt')) {
          const text = await file.text();
          combinedContent += text + "\n";
          validFiles++;
        }
      }

      if (validFiles === 0) {
        throw new Error('No valid .log or .txt files detected in selection.');
      }

      await processContent(combinedContent);
    } catch (err: any) {
      setError(err.message);
      setStatus(AppStatus.IDLE);
    }
  };

  const reset = () => {
    setResults(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const navigatePreprocessor = () => {
    setStatus(AppStatus.PREPROCESSING);
    setResults(null);
    setError(null);
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 bg-[#050507]">
      <Sidebar 
        onReset={reset} 
        onNavigatePreprocessor={navigatePreprocessor}
        currentStatus={status} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Layered atmospheric effects for smoother feel */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[150px] pointer-events-none rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[120px] pointer-events-none rounded-full animate-pulse [animation-delay:3s]"></div>

        <Header status={status} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 z-10 custom-scrollbar scroll-smooth">
          <div className="max-w-6xl mx-auto w-full transition-all duration-700">
            {error && (
              <div className="bg-red-950/20 border border-red-500/30 text-red-400 p-5 rounded-2xl mb-8 flex items-center gap-5 backdrop-blur-md animate-in slide-in-from-top-4 duration-500">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                  <i className="fas fa-triangle-exclamation text-lg"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-black cyber-font uppercase tracking-[0.2em] mb-1 text-sm">Operation Failure</h4>
                  <p className="text-xs opacity-70 font-mono">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <i className="fas fa-xmark"></i>
                </button>
              </div>
            )}

            {status === AppStatus.IDLE ? (
              <FileDropzone onFilesSelect={processLogFiles} />
            ) : status === AppStatus.PREPROCESSING ? (
              <LogPreprocessor onProcessCleaned={processContent} />
            ) : (status === AppStatus.PARSING || status === AppStatus.ANALYZING) ? (
              <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-1000">
                <div className="relative group">
                  {/* Enhanced Neural Pulse Animations */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping [animation-duration:3s]"></div>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping [animation-duration:6s] [animation-delay:1.5s]"></div>
                  
                  <div className="w-44 h-44 border-[2px] border-emerald-500/5 border-t-emerald-500 rounded-full animate-spin [animation-duration:1s]"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <i className="fas fa-microchip text-emerald-500/80 animate-pulse text-5xl mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></i>
                    <span className="text-[10px] font-mono text-emerald-500/50 font-black uppercase tracking-[0.3em]">Neural Link</span>
                  </div>
                </div>
                
                <h2 className="text-3xl cyber-font font-black mt-20 mb-8 tracking-[0.5em] text-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.5)] text-center uppercase">
                  {status === AppStatus.PARSING ? 'Parsing Data Streams' : 'Inferencing Threat Patterns'}
                </h2>
                
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
                
                <div className="w-80 h-2 bg-white/5 rounded-full overflow-hidden mb-8 shadow-inner border border-white/5">
                   <div className={`h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 transition-all duration-[4000ms] ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)] ${status === AppStatus.ANALYZING ? 'w-full' : 'w-1/2'}`}></div>
                </div>
                
                <p className="text-slate-500 text-[11px] font-mono uppercase tracking-[0.3em] max-w-sm text-center leading-relaxed">
                   Aggregating server nodes // Cross-referencing TTPs // Validating cryptographic integrity
                </p>
              </div>
            ) : (
              <Dashboard results={results} onReset={reset} />
            )}
          </div>
        </div>

        <footer className="bg-black/60 border-t border-white/5 p-4 text-center text-[10px] text-slate-600 backdrop-blur-xl z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between opacity-50">
             <p className="tracking-[0.25em] uppercase font-black">SentinelLog v2.3 // Neural Command</p>
             <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> AI: OPTIMAL</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> CORE: SYNCED</span>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
