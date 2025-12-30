
import React, { useState } from 'react';
import { AnalysisResult, AttackerStats } from '../types';

interface DashboardProps {
  results: AnalysisResult | null;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ results, onReset }) => {
  const [showSIEM, setShowSIEM] = useState(false);
  const [activeTab, setActiveTab] = useState<'immediate' | 'shortTerm' | 'longTerm'>('immediate');
  
  if (!results) return null;
  const { attackers, report, stats } = results;
  const isCompromised = stats.systemCompromised || report?.systemCompromised;

  const siemOutput = attackers.map(a => ({
    timestamp: new Date().toISOString(),
    attacker_ip: a.ip,
    attempts: a.failedAttempts,
    breach: a.successfulLoginDetected,
    severity: a.severity,
    mitre_ids: report?.mitreMapping.map(m => m.id),
    verdict: a.verdict,
    confidence: report?.confidenceScore,
    source: "SentinelLog_SOC_Engine"
  }));

  const downloadSIEM = () => {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(siemOutput, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", data);
    link.setAttribute("download", `siem_report_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* SECTION 1: INCIDENT STATUS (TOP CARD) */}
      <div className={`p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 ${isCompromised ? 'bg-red-600' : 'bg-slate-900 border border-white/10'}`}>
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${isCompromised ? 'bg-white/20' : 'bg-emerald-500/10 text-emerald-500'}`}>
          <i className={`fas ${isCompromised ? 'fa-biohazard animate-pulse' : 'fa-shield-check'} text-3xl`}></i>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black cyber-font uppercase text-white mb-2">
            {isCompromised ? 'SYSTEM COMPROMISED' : 'ATTACK BLOCKED'}
          </h2>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
             <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-white border border-white/20">
                VERDICT: {report?.verdict || 'ANOMALY DETECTED'}
             </span>
             <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-white border border-white/20">
                SEVERITY: {report?.severity || 'HIGH'}
             </span>
          </div>
        </div>
        <button onClick={onReset} className="bg-white text-black px-8 py-3 rounded-xl font-black text-xs cyber-font uppercase hover:bg-emerald-500 transition-all">
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION 2: SIMPLE SUMMARY */}
          <div className="bg-white/[0.03] border border-white/5 p-10 rounded-[2.5rem] shadow-xl">
             <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">🧠 What Happened?</h3>
             <p className="text-xl font-bold text-slate-100 leading-relaxed">
                {report?.plainEnglishSummary}
             </p>
          </div>

          {/* SECTION 3: KEY DETAILS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
                { label: 'Attacker IP', val: attackers[0]?.ip },
                { label: 'Failed Logins', val: stats.uniqueIPs > 0 ? results.totalFailedAttempts : 0 },
                { label: 'Breach Detected', val: isCompromised ? 'YES' : 'NO' },
                { label: 'Targeted Users', val: attackers[0]?.usersTargeted.slice(0,2).join(', ') || 'N/A' }
             ].map((item, i) => (
               <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">{item.label}</p>
                  <p className="text-sm font-bold text-slate-200">{item.val}</p>
               </div>
             ))}
          </div>

          {/* SECTION 5: ATTACK FLOW */}
          <div className="bg-white/[0.01] border border-white/5 p-10 rounded-[2.5rem]">
             <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">🧭 Attack Sequence</h3>
             <div className="flex flex-col md:flex-row gap-4">
                {report?.attackFlow.map((step, idx) => (
                  <div key={idx} className="flex-1 bg-black/40 p-6 rounded-2xl border border-white/5 relative group hover:border-indigo-500/30 transition-all">
                     <span className="text-[8px] font-black text-indigo-500 block mb-2">STEP {idx+1}</span>
                     <p className="text-[11px] font-bold text-slate-300 leading-tight uppercase">{step}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* SECTION 9: SIEM EXPORT */}
          <div className="bg-black border border-indigo-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                   <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">📤 SIEM READY OUTPUT</h3>
                   <p className="text-[9px] text-slate-600 uppercase font-mono mt-1">Ingestion ready flat schema</p>
                </div>
                <button onClick={downloadSIEM} className="bg-emerald-500 text-black px-6 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-white transition-all">
                  Download JSON
                </button>
             </div>
             <div className="p-8 bg-black/50 font-mono text-[10px] text-emerald-500/80 max-h-60 overflow-auto custom-scrollbar">
                <pre>{JSON.stringify(siemOutput, null, 2)}</pre>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* SECTION 4: WHY SERIOUS */}
           <div className={`p-8 rounded-[2rem] border-2 ${isCompromised ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
              <h3 className="text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">❓ Why this is serious</h3>
              <ul className="space-y-4">
                 {report?.severityReasoning.map((reason, i) => (
                   <li key={i} className="flex gap-3 text-[11px] font-bold text-slate-300">
                      <span className="text-orange-500 mt-1">●</span>
                      <span>{reason}</span>
                   </li>
                 ))}
              </ul>
           </div>

           {/* SECTION 6: WHAT TO DO NOW */}
           <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem]">
              <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">✅ Action Checklist</h3>
              <div className="flex border-b border-white/5 mb-6">
                {(['immediate', 'shortTerm', 'longTerm'] as const).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 pb-3 text-[9px] font-black uppercase tracking-widest ${activeTab === t ? 'text-white border-b-2 border-emerald-500' : 'text-slate-600'}`}>
                    {t.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
              <ul className="space-y-4">
                 {report?.actionSteps[activeTab].map((step, i) => (
                   <li key={i} className="flex gap-4 group">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[9px] text-emerald-500 font-bold shrink-0">{i+1}</div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">{step}</span>
                   </li>
                 ))}
              </ul>
           </div>

           {/* SECTION 8: CONFIDENCE */}
           <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] text-center">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Threat Confidence</p>
              <div className="text-4xl font-black text-indigo-400 mb-2">{report?.confidenceScore}%</div>
              <p className="text-[10px] font-bold text-slate-500 italic opacity-80">{report?.confidenceExplanation}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
