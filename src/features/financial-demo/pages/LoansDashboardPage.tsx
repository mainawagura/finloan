import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/api/authService';
import { LoanApplicationDto } from '../../../services/api/contracts';
import { useAuth } from '../../../shared/hooks/useAuth';
import { PermissionGate } from '../../../app/security/PermissionGate';
import { PERMISSIONS } from '../../../app/security/constants/permissions';
import { formatKES } from '../../../shared/utilities/currency';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  UserCheck,
  Ban,
  Clock,
} from 'lucide-react';

export const LoansDashboardPage: React.FC = () => {
  const [loans, setLoans] = useState<LoanApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [amount, setAmount] = useState('75000');
  const [purpose, setPurpose] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const { currentRole, userContext, hasPermission } = useAuth();

  const loadLoans = async () => {
    setLoading(false);
    const data = await authService.getLoans();
    setLoans(data);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleApprove = async (loan: LoanApplicationDto) => {
    try {
      await authService.approveLoan(
        loan.id,
        userContext?.user.id || 'usr-checker',
        userContext?.user.displayName || 'Credit Manager'
      );
      setFeedbackMessage({ text: `Loan ${loan.loanNumber} successfully approved and moved to underwriting record.` });
      await loadLoans();
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, error: true });
    }
  };

  const handleReject = async (loan: LoanApplicationDto) => {
    const reason = window.prompt('Please enter mandatory rejection reason (Section 7.1):', 'Exceeds maximum collateral loan-to-value ratio.');
    if (!reason) return;
    try {
      await authService.rejectLoan(
        loan.id,
        userContext?.user.id || 'usr-checker',
        userContext?.user.displayName || 'Credit Manager',
        reason
      );
      setFeedbackMessage({ text: `Loan ${loan.loanNumber} rejected with documented audit reason.` });
      await loadLoans();
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, error: true });
    }
  };

  const handleDisburse = async (loan: LoanApplicationDto) => {
    try {
      await authService.disburseLoan(loan.id, userContext?.user.displayName || 'Finance Officer');
      setFeedbackMessage({ text: `Loan ${loan.loanNumber} principal disbursed to borrower account.` });
      await loadLoans();
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, error: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Section 7.1 & 7.2 Maker-Checker Architecture
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Commercial Loan Processing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Demonstrates maker origination, checker approval boundaries, and disbursement control.
          </p>
        </div>

        {/* Maker Button protected by PermissionGate */}
        <PermissionGate
          permission={PERMISSIONS.LOANS_CREATE}
          fallback={
            <div className="px-3 py-2 bg-slate-100 rounded-lg text-xs text-slate-400 flex items-center gap-1.5 border border-slate-200">
              <Ban className="w-3.5 h-3.5" />
              <span>Create Loan (Requires LOAN_OFFICER)</span>
            </div>
          }
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Loan Application (Maker)</span>
          </button>
        </PermissionGate>
      </div>

      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between gap-3 ${
            feedbackMessage.error
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
      )}

      {/* Loans Grid / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {loans.map((loan) => {
          const isPending = loan.status === 'PENDING_APPROVAL';
          const isApproved = loan.status === 'APPROVED';
          const isDisbursed = loan.status === 'DISBURSED';
          const isRejected = loan.status === 'REJECTED';

          // Separation of duties rule: Loan maker cannot check their own loan!
          const isMakerOfThisLoan = userContext?.user.id === loan.makerUserId;

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{loan.loanNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isPending
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : isApproved
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : isDisbursed
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{loan.borrowerName}</h3>
                  <p className="text-xs text-slate-500">{loan.purpose}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{formatKES(loan.amount)}</span>
                  <p className="text-xs text-slate-500">{loan.interestRate}% APR • {loan.termMonths} Months</p>
                </div>
              </div>

              {/* Maker / Checker Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Maker (Originated By):</span>
                  <span className="font-semibold text-slate-800">{loan.makerName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Checker (Underwriter):</span>
                  <span className="font-semibold text-slate-800">
                    {loan.checkerName || (isPending ? 'Pending independent checker review' : 'N/A')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Optimistic Concurrency:</span>
                  <span className="font-mono text-slate-600">RowVersion v{loan.rowVersion}</span>
                </div>
              </div>

              {loan.rejectionReason && (
                <div className="mb-4 p-3 bg-rose-50 rounded-lg text-xs text-rose-800 border border-rose-200">
                  <strong>Rejection Note:</strong> {loan.rejectionReason}
                </div>
              )}

              {/* Action Buttons for Checker and Finance Roles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400">
                  Created {new Date(loan.createdAtUtc).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  {/* Checker Actions */}
                  {isPending && (
                    <>
                      <PermissionGate
                        permission={PERMISSIONS.LOANS_APPROVE}
                        fallback={
                          <span className="text-xs text-slate-400 italic">
                            Approve/Reject requires CREDIT_MANAGER role
                          </span>
                        }
                      >
                        {isMakerOfThisLoan ? (
                          <div className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Self-Approval Prohibited (Section 7.2)</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReject(loan)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                            >
                              Reject Application
                            </button>
                            <button
                              onClick={() => handleApprove(loan)}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve (Checker)</span>
                            </button>
                          </>
                        )}
                      </PermissionGate>
                    </>
                  )}

                  {/* Disbursement Action for Finance Officer */}
                  {isApproved && (
                    <PermissionGate
                      permission={PERMISSIONS.LOANS_DISBURSE}
                      fallback={
                        <span className="text-xs text-slate-400 italic">
                          Disbursement requires FINANCE_OFFICER role
                        </span>
                      }
                    >
                      <button
                        onClick={() => handleDisburse(loan)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Disburse Principal (Finance)</span>
                      </button>
                    </PermissionGate>
                  )}

                  {isDisbursed && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      Disbursed & Active in Ledger
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to simulate Maker creating a loan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Initiate Loan Application (Maker)</h3>
            <p className="text-xs text-slate-500">
              Loan will be created with status <code>PENDING_APPROVAL</code> awaiting an independent Credit Manager.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Borrower Commercial Name</label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="e.g. Zenith Global Logistics Ltd"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Principal Amount (KES)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stated Purpose</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Working capital line for inventory expansion"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFeedbackMessage({ text: 'Loan application submitted for independent checker underwriting.' });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
