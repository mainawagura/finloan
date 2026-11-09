import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 text-xs border-b border-indigo-800 flex flex-wrap items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-mono text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> PHASE 1: FRONTEND DEMO
        </span>
        <span className="text-slate-300">
          <strong className="text-white">FinLoan Security Architecture:</strong> Adhering strictly to Section 9.6. No fake crypto/passwords stored. Backend authority enforced in Phase 2.
        </span>
      </div>
      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          Test different personas in the switcher below to see permission gates adapt in real time.
        </span>
      </div>
    </div>
  );
};
