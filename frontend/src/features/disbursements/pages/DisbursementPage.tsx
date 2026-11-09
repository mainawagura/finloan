import React, { useState, useEffect } from 'react';
import { loanStore, DisbursementQueueItem } from '../../../services/api/loanManagementStore';
import { useAuth } from '../../../shared/hooks/useAuth';
import { PermissionGate } from '../../../app/security/PermissionGate';
import { PERMISSIONS } from '../../../app/security/constants/permissions';
import { formatKES } from '../../../shared/utilities/currency';
import {
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Building2,
  User,
  ShieldCheck,
  Clock,
  Lock,
} from 'lucide-react';
import { useNavigate } from '../../../app/router/router';

export const DisbursementPage: React.FC = () => {
  const [disbursements, setDisbursements] = useState<DisbursementQueueItem[]>(loanStore.getDisbursements());
  const [selectedItem, setSelectedItem] = useState<DisbursementQueueItem | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<DisbursementQueueItem['paymentMethod']>('BANK_TRANSFER');
  const [refNumber, setRefNumber] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { userContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return loanStore.subscribe(() => {
      setDisbursements(loanStore.getDisbursements());
    });
  }, []);

  const pendingDisbursements = disbursements.filter((d) => d.status === 'AWAITING_DISBURSEMENT');
  const completedDisbursements = disbursements.filter((d) => d.status === 'DISBURSED');

  const handleExecuteDisbursement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const newLoan = loanStore.executeDisbursement(
        selectedItem.id,
        userContext?.user.displayName || 'Marcus Chen (Finance Officer)',
        paymentChannel,
        refNumber || `DISB-TX-${Math.floor(100000 + Math.random() * 900000)}`
      );

      setFeedback(
        `Disbursement executed for ${selectedItem.customerName}! Net payout of ${formatKES(selectedItem.netDisbursement)} released. New loan account created: ${newLoan.loanNumber}.`
      );
      setSelectedItem(null);
      setRefNumber('');
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Module 4.7 Treasury & Disbursement
            </span>
            <span className="text-xs text-slate-400">{pendingDisbursements.length} Ready for Payout</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Disbursement Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Net payout execution for approved credit facilities. Payout immediately initiates the loan repayment ledger.
          </p>
        </div>

        <button
          onClick={() => navigate('/loan-accounts')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-sm transition"
        >
          <span>View Active Loan Ledgers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Awaiting Disbursement Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Approved Facilities Ready for Disbursement</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {pendingDisbursements.length}
          </span>
        </h3>

        {pendingDisbursements.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No approved loans currently waiting in the disbursement queue.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingDisbursements.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{item.applicationNumber}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                      Approved by {item.approvedBy}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.customerName}</h4>
                  <p className="text-xs text-slate-500">{item.productName}</p>
                  <p className="text-[11px] text-slate-400">Target Channel: <strong>{item.destinationAccount}</strong></p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">Net Payout to Borrower:</span>
                    <span className="font-mono text-xl font-black text-emerald-700">
                      {formatKES(item.netDisbursement)}
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Gross {formatKES(item.approvedAmount)} - Fees {formatKES(item.processingFee + item.insuranceFee)}
                    </p>
                  </div>

                  <PermissionGate
                    permission={PERMISSIONS.LOANS_DISBURSE}
                    fallback={
                      <div className="px-3 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs flex items-center gap-1.5 border border-slate-200">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Requires FINANCE_OFFICER</span>
                      </div>
                    }
                  >
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setPaymentChannel(item.paymentMethod);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Execute Disbursement</span>
                    </button>
                  </PermissionGate>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Disbursements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Recent Completed Disbursements ({completedDisbursements.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Disbursement Ref</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Gross Principal</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Disbursed By</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedDisbursements.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{d.disbursementReference}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{d.customerName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{formatKES(d.approvedAmount)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{formatKES(d.netDisbursement)}</td>
                  <td className="py-3 px-4">{d.paymentMethod}</td>
                  <td className="py-3 px-4">{d.disbursedBy}</td>
                  <td className="py-3 px-4 text-right font-mono text-[11px]">
                    {d.disbursedAtUtc ? new Date(d.disbursedAtUtc).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execute Disbursement Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Confirm Capital Disbursement</h3>
                <p className="text-xs text-slate-300 mt-0.5">{selectedItem.applicationNumber} • {selectedItem.customerName}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleExecuteDisbursement} className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Approved Facility:</span>
                  <strong className="font-mono text-slate-900 text-sm">{formatKES(selectedItem.approvedAmount)}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Less Origination Processing Fee:</span>
                  <span className="font-mono text-rose-600">-{formatKES(selectedItem.processingFee)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Less Credit Life Insurance:</span>
                  <span className="font-mono text-rose-600">-{formatKES(selectedItem.insuranceFee)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Net Disbursement Payout:</span>
                  <strong className="font-mono text-lg font-black text-emerald-700">
                    {formatKES(selectedItem.netDisbursement)}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Payment Method / Channel</label>
                <select
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="BANK_TRANSFER">Commercial Bank Wire / RTGS</option>
                  <option value="MPESA_B2C">Safaricom M-Pesa B2C Bulk Payment</option>
                  <option value="FEDWIRE">Fedwire / Direct Electronic Settlement</option>
                  <option value="ACH">Automated Clearing House (ACH)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  Payment Reference / Transaction Voucher ID
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g. WTX-2026-990421"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                <strong>Accounting Impact:</strong> Execution debits the Treasury Cash Account, credits Loan Principal Asset, and establishes an active loan account with an amortization repayment schedule.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Release Funds</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
