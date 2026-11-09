import React, { useState, useEffect } from 'react';
import { loanStore, RepaymentRecord, LoanAccount } from '../../../services/api/loanManagementStore';
import { useAuth } from '../../../shared/hooks/useAuth';
import { PermissionGate } from '../../../app/security/PermissionGate';
import { PERMISSIONS } from '../../../app/security/constants/permissions';
import { formatKES } from '../../../shared/utilities/currency';
import {
  RotateCcw,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const RepaymentsPage: React.FC = () => {
  const [repayments, setRepayments] = useState<RepaymentRecord[]>(loanStore.getRepayments());
  const [loans, setLoans] = useState<LoanAccount[]>(loanStore.getLoanAccounts());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'POSTED' | 'REVERSED'>('ALL');

  // Record Repayment Form State
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string>(loans[0]?.id || '');
  const [repaymentAmount, setRepaymentAmount] = useState<number>(3500);
  const [paymentMethod, setPaymentMethod] = useState<RepaymentRecord['paymentMethod']>('BANK_TRANSFER');
  const [customRef, setCustomRef] = useState('');

  // Reversal Modal State
  const [selectedToReverse, setSelectedToReverse] = useState<RepaymentRecord | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { userContext } = useAuth();

  useEffect(() => {
    return loanStore.subscribe(() => {
      setRepayments(loanStore.getRepayments());
      setLoans(loanStore.getLoanAccounts());
    });
  }, []);

  const filteredRepayments = repayments.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedLoan = loans.find((l) => l.id === selectedLoanId);

  const handleRecordRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    try {
      const record = loanStore.recordRepayment({
        loanId: selectedLoan.id,
        amount: Number(repaymentAmount),
        paymentMethod,
        referenceNumber: customRef,
      });

      setFeedback(
        `Repayment ${record.referenceNumber} of ${formatKES(record.amount)} posted successfully! Allocated: Principal ${formatKES(record.allocatedPrincipal)}, Interest ${formatKES(record.allocatedInterest)}.`
      );
      setShowRecordModal(false);
      setCustomRef('');
    } catch (err: any) {
      setFeedback(err.message);
    }
  };

  const handleExecuteReversal = () => {
    if (!selectedToReverse || !reversalReason.trim()) return;

    try {
      loanStore.reverseRepayment(
        selectedToReverse.id,
        reversalReason,
        userContext?.user.displayName || 'Marcus Chen (Finance Officer)'
      );
      setFeedback(`Reversal for transaction ${selectedToReverse.referenceNumber} executed. Loan balances restored.`);
      setSelectedToReverse(null);
      setReversalReason('');
    } catch (err: any) {
      setFeedback(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
              Module 4.8 & 4.9 Payment Operations
            </span>
            <span className="text-xs text-slate-400">{repayments.length} Transactions Recorded</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Loan Repayments & Controlled Reversals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time waterfall allocation (Penalties → Interest → Principal), multi-channel reconciliation, and audited reversals.
          </p>
        </div>

        <PermissionGate
          permission={PERMISSIONS.REPAYMENTS_RECORD}
          fallback={
            <div className="px-3 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs border border-slate-200">
              Post Payment (Requires repayments.record)
            </div>
          }
        >
          <button
            onClick={() => setShowRecordModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post Inbound Repayment</span>
          </button>
        </PermissionGate>
      </div>

      {feedback && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-teal-600 hover:text-teal-900">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by transaction ref, loan account #, or borrower"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Repayment Statuses</option>
            <option value="POSTED">Posted (Settled)</option>
            <option value="REVERSED">Reversed</option>
          </select>
        </div>
      </div>

      {/* Repayments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Loan Account & Borrower</th>
                <th className="py-3.5 px-4">Amount Paid</th>
                <th className="py-3.5 px-4">Waterfall Allocation</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRepayments.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{r.referenceNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{r.customerName}</p>
                    <span className="font-mono text-[10px] text-slate-400">{r.loanNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">
                    +{formatKES(r.amount)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="text-blue-700 font-semibold">P: {formatKES(r.allocatedPrincipal)}</span> •{' '}
                    <span className="text-purple-700">I: {formatKES(r.allocatedInterest)}</span>
                    {r.allocatedPenalties > 0 && (
                      <span className="text-rose-600"> • Fee: {formatKES(r.allocatedPenalties)}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {r.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {new Date(r.timestampUtc).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {r.status === 'POSTED' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Posted
                      </span>
                    ) : (
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Reversed
                        </span>
                        <p className="text-[10px] text-rose-600 mt-0.5 max-w-xs">{r.reversalReason}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.status === 'POSTED' ? (
                      <PermissionGate
                        permission={PERMISSIONS.REPAYMENTS_REVERSE}
                        fallback={
                          <span className="text-[11px] text-slate-400 italic">
                            Requires repayments.reverse
                          </span>
                        }
                      >
                        <button
                          onClick={() => setSelectedToReverse(r)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reverse</span>
                        </button>
                      </PermissionGate>
                    ) : (
                      <span className="text-[11px] text-slate-400">Reversed by {r.reversedBy}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Repayment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Post Borrower Repayment (Module 4.8)</h3>
                <p className="text-xs text-slate-300 mt-0.5">Automated waterfall allocation to penalties, interest & principal</p>
              </div>
              <button onClick={() => setShowRecordModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordRepayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Select Active Loan Account</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  {loans
                    .filter((l) => l.status === 'ACTIVE' || l.status === 'IN_ARREARS')
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.loanNumber} — {l.customerName} (Bal: {formatKES(l.outstandingBalance)})
                      </option>
                    ))}
                </select>
              </div>

              {selectedLoan && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Balance:</span>
                    <strong className="font-mono text-slate-900">{formatKES(selectedLoan.outstandingBalance)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Accrued Interest:</span>
                    <strong className="font-mono text-purple-700">{formatKES(selectedLoan.outstandingInterest)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Late Penalties:</span>
                    <strong className="font-mono text-rose-600">{formatKES(selectedLoan.outstandingPenalties)}</strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Payment Amount (KES)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Payment Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="BANK_TRANSFER">Bank Wire / Electronic RTGS</option>
                    <option value="MPESA">Safaricom M-Pesa C2B Paybill</option>
                    <option value="CASH">Institutional Cash Deposit</option>
                    <option value="CHEQUE">Banker's Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">External Transaction Reference / Code</label>
                <input
                  type="text"
                  value={customRef}
                  onChange={(e) => setCustomRef(e.target.value)}
                  placeholder="e.g. QK89102919 or WIRE-REF-908"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Post & Allocate Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reversal Modal */}
      {selectedToReverse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 space-y-4 p-6">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Execute Financial Reversal: {selectedToReverse.referenceNumber}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reversing {formatKES(selectedToReverse.amount)} for {selectedToReverse.customerName}. Section 7.5 mandates a documented reversal reason and prevents deleting the historical transaction.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mandatory Audit Reversal Reason
              </label>
              <textarea
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                rows={3}
                placeholder="e.g. Returned wire due to incorrect swift account identifier."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setSelectedToReverse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReversal}
                disabled={!reversalReason.trim()}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition shadow-xs ${
                  reversalReason.trim()
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Confirm Financial Reversal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
