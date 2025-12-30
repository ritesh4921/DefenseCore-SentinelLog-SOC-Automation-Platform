
import React, { useRef, useState } from 'react';

interface FileDropzoneProps {
  onFilesSelect: (files: FileList) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-bold mb-3 cyber-font tracking-tight glitch">COMMAND <span className="text-emerald-500">TERMINAL</span></h1>
        <p className="text-slate-400 text-lg">Ingest <code className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono text-sm">auth.log</code> streams from one or more servers.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden group ${isDragging ? 'border-emerald-500 bg-emerald-500/5 scale-[1.02]' : 'border-white/10 hover:border-emerald-500/40 bg-white/[0.02]'}`}
      >
        <div className={`absolute left-0 right-0 h-0.5 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-0 ${isDragging ? 'animate-[scan_2s_linear_infinite]' : 'hidden group-hover:block animate-[scan_4s_linear_infinite]'}`}></div>
        
        <style>{`
          @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
          }
        `}</style>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => e.target.files && onFilesSelect(e.target.files)}
          className="hidden" 
          accept=".log,.txt"
          multiple
        />
        
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 z-10 ${isDragging ? 'scale-110 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-slate-800/50 text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10'}`}>
          <i className="fas fa-folder-open text-4xl"></i>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 cyber-font tracking-wider z-10">DROP LOG FILES</h3>
        <p className="text-slate-500 text-center max-w-lg z-10 leading-relaxed font-medium">
          Drag & drop authentication logs. Support for <span className="text-indigo-400 font-bold">Multi-Server Analysis</span>. Logs will be cross-referenced for lateral movement and distributed brute-force.
        </p>
        
        <button className="mt-10 px-8 py-3 bg-white/5 hover:bg-emerald-500 hover:text-black hover:font-bold rounded-xl text-sm transition-all duration-300 border border-white/10 group-hover:border-emerald-500/50 z-10 cyber-font tracking-widest uppercase">
          Select Log Resources
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[
          { icon: 'fa-shield-halved', title: 'Brute Force Shield', color: 'emerald', desc: 'Identify high-velocity SSH attempts with cross-file detection.' },
          { icon: 'fa-user-check', title: 'Breach Detection', color: 'indigo', desc: 'Neural tracking of successful logins following brute-force patterns.' },
          { icon: 'fa-earth-americas', title: 'Geo-IP Insights', color: 'amber', desc: 'Automatic origin enrichment to map adversarial infrastructure.' }
        ].map((item, idx) => (
          <div key={idx} className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/10 hover:bg-white/[0.05] transition-all card-glow group">
            <div className={`w-12 h-12 bg-${item.color}-500/10 rounded-xl flex items-center justify-center text-${item.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${item.icon} text-xl`}></i>
            </div>
            <h4 className="font-bold text-lg mb-3 cyber-font tracking-wide">{item.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDropzone;
