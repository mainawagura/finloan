import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/api/authService';
import { LoginHistoryDto } from '../../../services/api/contracts';
import { History, CheckCircle2, XCircle, ShieldAlert, Monitor, Globe, Filter } from 'lucide-react';

export const LoginHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<LoginHistoryDto[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');

  useEffect(() => {
    authService.getLoginHistory().then(setHistory);
  }, []);

  const filtered = history.filter((item) => {
    if (filter === 'SUCCESS') return item.success;
    if (filter === 'FAILED') return !item.success;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Authentication & Login History (Section 4.7)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracks login outcomes, anomalous IPs, failure reasons, and correlation identifiers.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Attempts ({history.length})
          </button>
          <button
            onClick={() => setFilter('SUCCESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'SUCCESS' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Successful
          </button>
          <button
            onClick={() => setFilter('FAILED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'FAILED' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Status & Reason</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Device & Browser</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    {item.success ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Successful
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> {item.failureCategory || 'FAILED'}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    {new Date(item.timestampUtc).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{item.username}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{item.deviceName}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.browserName} on {item.operatingSystem}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{item.ipAddress}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-600 bg-indigo-50/40 rounded">
                    {item.correlationId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
