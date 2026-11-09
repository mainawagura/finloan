import React, { useState, useEffect } from 'react';
import { loanStore, RecoveryAccount } from '../../../services/api/loanManagementStore';
import { useAuth } from '../../../shared/hooks/useAuth';
import { formatKES } from '../../../shared/utilities/currency';
import {
  AlertTriangle,
  Phone,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle2,
  User,
  Plus,
  Send,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';

export const LoanRecoveryPage: React.FC = () => {
  const [recoveries, setRecoveries] = useState<RecoveryAccount[]>(loanStore.getRecoveries());
  const [selectedRecovery, setSelectedRecovery] = useState<RecoveryAccount | null>(null);
  const [showPtpModal, setShowPtpModal] = useState(false);

  // Follow-up modal form state
  const [ptpDate, setPtpDate] = useState('2026-11-20');
  const [promisedAmount, setPromisedAmount] = useState<number>(3400);
  const [officerNote, setOfficerNote] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { userContext } = useAuth();

  useEffect(() => {
    return loanStore.subscribe(() => {
      setRecoveries(loanStore.getRecoveries());
      if (selectedRecovery) {
        const updated = loanStore.getRecoveries().find((r) => r.id === selectedRecovery.id);
        setSelectedRecovery(updated || null);
      }
    });
  }, [selectedRecovery]);

  const handleSavePromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecovery) return;

    loanStore.recordRecoveryPromise(
      selectedRecovery.id,
      ptpDate,
      Number(promisedAmount),
      userContext?.user.displayName || 'Patricia O\'Connor (Recovery Officer)',
      officerNote || 'Customer contacted via direct phone. Committed to clear installment.'
    );

    setFeedback(`Promise to Pay (PTP) recorded for ${selectedRecovery.customerName} on ${ptpDate}.`);
    setShowPtpModal(false);
    setOfficerNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              Module 4.11 Delinquency & Recovery
            </span>
            <span className="text-xs text-slate-400">{recoveries.length} High-Risk Accounts</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Recovery Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Portfolio at Risk (PAR 30/60/90+), collection action logs, promise-to-pay (PTP) tracking, and recovery officer assignments.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Recoveries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Borrower & Loan #</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Total Balance</th>
                <th className="py-3.5 px-4">Overdue Arrears</th>
                <th className="py-3.5 px-4">Days in Arrears</th>
                <th className="py-3.5 px-4">PAR Bucket</th>
                <th className="py-3.5 px-4">Recovery Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recoveries.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{rec.customerName}</p>
                    <span className="font-mono text-[10px] text-slate-400">{rec.loanNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{rec.phone}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatKES(rec.outstandingBalance)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                    {formatKES(rec.outstandingArrears)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {rec.daysInArrears} Days
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      {rec.parBucket}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {rec.recoveryStatus}
                    </span>
                    {rec.promiseToPayDate && (
                      <p className="text-[10px] text-emerald-700 mt-0.5">
                        PTP: {rec.promiseToPayDate} ({formatKES(rec.promisedAmount || 0)})
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRecovery(rec)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Engagement Log</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Log & Add PTP Drawer */}
      {selectedRecovery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Recovery Case: {selectedRecovery.customerName}</h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white">
                    {selectedRecovery.daysInArrears} Days Past Due
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Loan #{selectedRecovery.loanNumber} • Assigned to {selectedRecovery.assignedOfficer}
                </p>
              </div>
              <button onClick={() => setSelectedRecovery(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Total Balance:</span>
                  <strong className="font-mono text-slate-900 text-sm">{formatKES(selectedRecovery.outstandingBalance)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Arrears Due:</span>
                  <strong className="font-mono text-rose-600 text-sm">{formatKES(selectedRecovery.outstandingArrears)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Direct Phone:</span>
                  <strong className="font-mono text-slate-900 text-sm">{selectedRecovery.phone}</strong>
                </div>
              </div>

              {selectedRecovery.promiseToPayDate && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[11px] block">Active Promise to Pay (PTP)</span>
                    <p className="text-[11px]">
                      Borrower agreed to settle <strong>{formatKES(selectedRecovery.promisedAmount || 0)}</strong> on{' '}
                      <strong>{selectedRecovery.promiseToPayDate}</strong>.
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              )}

              {/* Action: Add PTP */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Chronological Follow-up Notes & Call History ({selectedRecovery.notes.length})
                </span>
                <button
                  onClick={() => setShowPtpModal(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Call / Record PTP</span>
                </button>
              </div>

              <div className="space-y-2">
                {selectedRecovery.notes.map((n, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <strong className="text-slate-800">{n.officer}</strong>
                      <span className="font-mono">{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">{n.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedRecovery(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Close Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record PTP Modal */}
      {showPtpModal && selectedRecovery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Record Follow-up & Promise to Pay</h3>

            <form onSubmit={handleSavePromise} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Committed Promise-to-Pay Date</label>
                <input
                  type="date"
                  value={ptpDate}
                  onChange={(e) => setPtpDate(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Promised Payment Amount (KES)</label>
                <input
                  type="number"
                  value={promisedAmount}
                  onChange={(e) => setPromisedAmount(Number(e.target.value))}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recovery Officer Notes</label>
                <textarea
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  rows={3}
                  required
                  placeholder="Detail conversation, reasons given for delay, agreed next escalation step..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPtpModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Save Engagement Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
