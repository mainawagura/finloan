import React, { useState, useEffect } from 'react';
import { loanStore, LoanApplication } from '../../../services/api/loanManagementStore';
import { useAuth } from '../../../shared/hooks/useAuth';
import { PermissionGate } from '../../../app/security/PermissionGate';
import { PERMISSIONS } from '../../../app/security/constants/permissions';
import { formatKES } from '../../../shared/utilities/currency';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Building2,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useNavigate } from '../../../app/router/router';

export const LoanApprovalsPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>(loanStore.getApplications());
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);

  const { currentRole, userContext, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return loanStore.subscribe(() => {
      setApplications(loanStore.getApplications());
      if (selectedApp) {
        setSelectedApp(loanStore.getApplicationById(selectedApp.id) || null);
      }
    });
  }, [selectedApp]);

  const pendingApprovals = applications.filter(
    (a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED'
  );
  const reviewedApplications = applications.filter(
    (a) => a.status === 'APPROVED' || a.status === 'REJECTED'
  );

  const handleApprove = (app: LoanApplication) => {
    if (!decisionNotes.trim()) {
      setFeedback({ message: 'Mandatory Checker Rule: You must enter a credit approval decision comment.', isError: true });
      return;
    }

    try {
      loanStore.approveApplication(
        app.id,
        userContext?.user.id || 'usr-checker',
        userContext?.user.displayName || 'Elena Rostova (Credit Manager)',
        decisionNotes
      );
      setFeedback({
        message: `Application ${app.applicationNumber} approved by ${userContext?.user.displayName}. Loan has been queued to Disbursements!`,
      });
      setSelectedApp(null);
      setDecisionNotes('');
    } catch (err: any) {
      setFeedback({ message: err.message, isError: true });
    }
  };

  const handleReject = (app: LoanApplication) => {
    if (!decisionNotes.trim()) {
      setFeedback({ message: 'Mandatory Checker Rule: Please enter the specific institutional rejection reason.', isError: true });
      return;
    }

    try {
      loanStore.rejectApplication(
        app.id,
        userContext?.user.id || 'usr-checker',
        userContext?.user.displayName || 'Elena Rostova (Credit Manager)',
        decisionNotes
      );
      setFeedback({
        message: `Application ${app.applicationNumber} declined. Rejection reason recorded in audit trail.`,
      });
      setSelectedApp(null);
      setDecisionNotes('');
    } catch (err: any) {
      setFeedback({ message: err.message, isError: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              Module 4.6 Maker-Checker Enforcement
            </span>
            <span className="text-xs text-slate-400">{pendingApprovals.length} Awaiting Checker Decision</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Approval Queue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Independent credit underwriter authorization. The maker cannot approve their own application.
          </p>
        </div>

        <button
          onClick={() => navigate('/disbursements')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
        >
          <span>View Disbursement Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between gap-3 ${
            feedback.isError
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Separation of Duties Alert Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950 text-sm mb-1">
            Section 7.2 Separation of Duties Rule
          </h4>
          <p className="text-amber-800 leading-relaxed">
            Only the <strong>CREDIT_MANAGER</strong> persona can execute loan approvals or rejections. The loan officer who created the application cannot approve it. Super Administrator accounts cannot self-approve without independent checker sign-off.
          </p>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Loans Awaiting Checker Decision</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            {pendingApprovals.length}
          </span>
        </h3>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No applications currently awaiting approval decisions.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingApprovals.map((app) => {
              const isMakerOfThisApp = userContext?.user.id === app.makerUserId;

              return (
                <div
                  key={app.id}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{app.applicationNumber}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        {app.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{app.customerName}</h4>
                    <p className="text-xs text-slate-500">{app.productName} • {app.termMonths} Months Term</p>
                    <p className="text-[11px] text-slate-400">
                      Originated by Maker: <strong>{app.makerName}</strong> on {new Date(app.submittedAtUtc).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-left sm:text-right">
                      <span className="font-mono text-xl font-black text-slate-900">
                        {formatKES(app.requestedAmount)}
                      </span>
                      <p className="text-xs text-slate-500">DTI Ratio: <strong className="text-slate-800">{app.dtiRatio}%</strong></p>
                    </div>

                    <PermissionGate
                      permission={PERMISSIONS.LOANS_APPROVE}
                      fallback={
                        <div className="px-3 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs flex items-center gap-1.5 border border-slate-200">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Requires CREDIT_MANAGER</span>
                        </div>
                      }
                    >
                      {isMakerOfThisApp ? (
                        <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Self-Approval Prohibited</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setDecisionNotes('');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
                        >
                          Review & Decide
                        </button>
                      )}
                    </PermissionGate>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Reviewed Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Recent Decision Audit History ({reviewedApplications.length})
        </h3>
        <div className="space-y-3">
          {reviewedApplications.map((app) => (
            <div key={app.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{app.applicationNumber}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{app.customerName} ({formatKES(app.requestedAmount)})</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Decided by Checker: <strong>{app.checkerName || 'Credit Underwriter'}</strong> • Notes: {app.approvalNotes || app.rejectionReason}
                </p>
              </div>
              <div className="text-right text-slate-400 text-[11px]">
                {app.reviewedAtUtc ? new Date(app.reviewedAtUtc).toLocaleString() : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Credit Underwriter Decision (Checker)</h3>
                <p className="text-xs text-slate-300 mt-0.5">Application: {selectedApp.applicationNumber} • {selectedApp.customerName}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Principal Amount:</span>
                  <strong className="text-slate-900 font-mono text-base">{formatKES(selectedApp.requestedAmount)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Term & Facility:</span>
                  <strong className="text-slate-900 text-sm">{selectedApp.termMonths} Mos • {selectedApp.productName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Debt-to-Income:</span>
                  <strong className="text-slate-900 font-mono text-sm">{selectedApp.dtiRatio}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Credit Bureau Score:</span>
                  <strong className="text-emerald-700 font-mono text-sm">{selectedApp.creditScore} / 850</strong>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1 uppercase tracking-wider">
                  Mandatory Checker Decision Comment / Approval Audit Notes
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter formal justification, debt service capacity confirmation, or rejection reason..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Disbursement Notice:</strong> Approved loans are immediately queued to the <strong>Finance Officer Disbursement Queue</strong>. Rejected applications are permanently archived with rejection reason.
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReject(selectedApp)}
                    className="px-4 py-2 font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-xs"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedApp)}
                    className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Advance to Disbursement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
