
import React from 'react';
import { AppStatus } from '../types';

interface SidebarProps {
  onReset: () => void;
  onNavigatePreprocessor: () => void;
  currentStatus: AppStatus;
}

const Sidebar: React.FC<SidebarProps> = ({ onReset, onNavigatePreprocessor, currentStatus }) => {
  return (
    <aside className="w-64 bg-[#0a0a0c] border-r border-white/5 flex flex-col hidden lg:flex z-30">
      <div className="p-6">
        <div className="mb-10">
          <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-6 pl-3">Main Operations</h3>
          <nav className="space-y-2">
            <button 
              onClick={onReset}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${currentStatus === AppStatus.IDLE || currentStatus === AppStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
            >
              <i className={`fas fa-radar w-5 group-hover:scale-110 transition-transform ${currentStatus === AppStatus.IDLE || currentStatus === AppStatus.COMPLETED ? 'text-emerald-500' : ''}`}></i>
              <span className="font-semibold tracking-wide">Threat Analysis</span>
            </button>
            <button 
              onClick={onNavigatePreprocessor}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${currentStatus === AppStatus.PREPROCESSING ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
            >
              <i className={`fas fa-microchip w-5 group-hover:scale-110 transition-transform ${currentStatus === AppStatus.PREPROCESSING ? 'text-indigo-500' : ''}`}></i>
              <span className="font-semibold tracking-wide">Data Scrubber</span>
            </button>
          </nav>
        </div>

        <div className="mb-10">
          <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-6 pl-3">Security Modules</h3>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm text-slate-700 cursor-not-allowed group">
              <i className="fas fa-network-wired w-5 opacity-50"></i>
              <span className="font-medium">Intrusion Map</span>
              <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">LOCKED</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm text-slate-700 cursor-not-allowed group">
              <i className="fas fa-user-secret w-5 opacity-50"></i>
              <span className="font-medium">OSINT Search</span>
              <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">LOCKED</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
          <p className="text-[9px] text-slate-500 mb-3 uppercase tracking-widest font-bold flex items-center justify-between">
            SYSTEM LOAD
            <span className="text-emerald-500 animate-pulse">OPTIMAL</span>
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-[78%] animate-pulse"></div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">78%</span>
          </div>
          <div className="space-y-2 text-[9px] font-mono text-slate-500">
            <div className="flex justify-between">
              <span>LATENCY:</span>
              <span className="text-slate-300">12ms</span>
            </div>
            <div className="flex justify-between">
              <span>UPTIME:</span>
              <span className="text-slate-300">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
