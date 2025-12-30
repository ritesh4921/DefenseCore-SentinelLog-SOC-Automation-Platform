
import React from 'react';
import { AppStatus } from '../types';

interface HeaderProps {
  status: AppStatus;
}

const Header: React.FC<HeaderProps> = ({ status }) => {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
            <i className="fas fa-shield-halved text-black text-xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tighter cyber-font glitch">SENTINEL<span className="text-emerald-500">LOG</span></span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold -mt-1">Digital Forensics</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span>UPLINK: ACTIVE</span>
          </div>
          <div className="w-[1px] h-3 bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>AI CORE: ONLINE</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2"></div>

        <div className={`px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-500 ${status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800/40 text-slate-400'}`}>
           <span className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-amber-500 animate-pulse'}`}></span>
           {status}
        </div>
      </div>
    </header>
  );
};

export default Header;
