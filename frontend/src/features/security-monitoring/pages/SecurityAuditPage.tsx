import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/api/authService';
import { SecurityAuditEventDto } from '../../../services/api/contracts';
import { ShieldCheck, Link2, CheckCircle2, AlertOctagon, Hash, Filter, Terminal } from 'lucide-react';

export const SecurityAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<SecurityAuditEventDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    authService.getAuditLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory === 'ALL') return true;
    return log.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              Section 8.3 Tamper-Evident Architecture
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Security & Compliance Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Append-only audit ledger with cryptographic SHA-256 hash chaining.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Categories ({logs.length})</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="SESSIONS">Sessions</option>
            <option value="AUTHORIZATION">Authorization</option>
            <option value="LOANS">Loans</option>
            <option value="REPAYMENTS">Repayments</option>
          </select>
        </div>
      </div>

      {/* Visual Hash Chain Timeline */}
      <div className="space-y-4">
        {filteredLogs.map((event, idx) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 relative overflow-hidden transition hover:border-slate-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  #{logs.length - idx}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-sm">{event.action}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {event.category}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {event.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Actor: <strong className="text-slate-800">{event.actorDisplayName}</strong> ({event.actorRole}) • Entity: <code className="bg-slate-100 px-1 py-0.2 rounded text-[11px]">{event.entityType}:{event.entityId}</code>
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <p className="font-mono text-slate-700">{new Date(event.timestampUtc).toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Correlation: {event.correlationId}</p>
              </div>
            </div>

            {/* Metadata Payload if present */}
            {event.metadata && (
              <div className="mb-3 p-2.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Payload: {JSON.stringify(event.metadata)}</span>
              </div>
            )}

            {/* Cryptographic Hash Chaining Verification (Section 8.3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900 text-slate-300 p-3 rounded-lg">
              <div className="truncate">
                <span className="text-purple-400 flex items-center gap-1 mb-0.5">
                  <Link2 className="w-3 h-3 text-purple-400" /> Previous Event Hash:
                </span>
                <span className="text-slate-400 text-[10px] select-all">{event.previousEventHash}</span>
              </div>
              <div className="truncate">
                <span className="text-emerald-400 flex items-center gap-1 mb-0.5">
                  <Hash className="w-3 h-3 text-emerald-400" /> Current Event Hash:
                </span>
                <span className="text-emerald-300 text-[10px] select-all">{event.eventHash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
