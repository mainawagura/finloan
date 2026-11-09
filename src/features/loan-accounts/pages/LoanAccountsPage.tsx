import React, { useState, useEffect } from 'react';
import { loanStore, LoanAccount } from '../../../services/api/loanManagementStore';
import { formatKES } from '../../../shared/utilities/currency';
import {
  FileText,
  Search,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from '../../../app/router/router';

export const LoanAccountsPage: React.FC = () => {
  const [loans, setLoans] = useState<LoanAccount[]>(loanStore.getLoanAccounts());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLoan, setSelectedLoan] = useState<LoanAccount | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    return loanStore.subscribe(() => {
      setLoans(loanStore.getLoanAccounts());
      if (selectedLoan) {
        setSelectedLoan(loanStore.getLoanById(selectedLoan.id) || null);
      }
    });
  }, [selectedLoan]);

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      l.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
              Module 4.10 Active Loan Portfolios
            </span>
            <span className="text-xs text-slate-400">{loans.length} Accounts Under Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Accounts & Amortization Schedules</h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional portfolio ledgers, amortization schedule tracking, interest accruals, and arrears monitoring.
          </p>
        </div>

        <button
          onClick={() => navigate('/repayments')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
        >
          <span>Record Loan Repayment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by loan account # or borrower name"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
        >
          <option value="ALL">All Account Statuses</option>
          <option value="ACTIVE">Active (In Good Standing)</option>
          <option value="IN_ARREARS">In Arrears</option>
          <option value="SETTLED">Settled / Paid Off</option>
          <option value="DEFAULTED">Defaulted</option>
        </select>
      </div>

      {/* Loan Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Loan Account</th>
                <th className="py-3.5 px-4">Borrower Entity</th>
                <th className="py-3.5 px-4">Disbursed Principal</th>
                <th className="py-3.5 px-4">Total Paid</th>
                <th className="py-3.5 px-4">Outstanding Balance</th>
                <th className="py-3.5 px-4">Next Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-slate-900">{loan.loanNumber}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{loan.productName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{loan.customerName}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Disbursed {loan.disbursementDate}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatKES(loan.principalAmount)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700">
                    {formatKES(loan.totalPaid)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                    {formatKES(loan.outstandingBalance)}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-mono text-slate-800">{loan.nextPaymentDate}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Due: {formatKES(loan.nextPaymentAmount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {loan.status === 'ACTIVE' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active (Good Standing)
                      </span>
                    )}
                    {loan.status === 'IN_ARREARS' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        In Arrears ({loan.daysInArrears}d)
                      </span>
                    )}
                    {loan.status === 'SETTLED' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Settled
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLoan(loan)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amortization Schedule Drawer / Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Loan Account #{selectedLoan.loanNumber}</h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500 text-white">
                    {selectedLoan.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Borrower: {selectedLoan.customerName} • Facility: {selectedLoan.productName}
                </p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Account Financial Balances Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-4 gap-3 text-xs text-center">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Disbursed Principal:</span>
                <strong className="font-mono text-slate-900">{formatKES(selectedLoan.principalAmount)}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Outstanding Principal:</span>
                <strong className="font-mono text-blue-700">{formatKES(selectedLoan.outstandingPrincipal)}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Accrued Interest:</span>
                <strong className="font-mono text-purple-700">{formatKES(selectedLoan.outstandingInterest)}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Accrued Late Penalties:</span>
                <strong className="font-mono text-rose-600">{formatKES(selectedLoan.outstandingPenalties)}</strong>
              </div>
            </div>

            {/* Repayment Schedule Table */}
            <div className="p-6 overflow-y-auto flex-1">
              <h4 className="font-bold text-slate-900 text-xs mb-3">Installment Repayment Amortization Schedule</h4>
              <table className="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Principal Due</th>
                    <th className="py-2.5 px-3">Interest Due</th>
                    <th className="py-2.5 px-3">Total Installment</th>
                    <th className="py-2.5 px-3">Paid Amount</th>
                    <th className="py-2.5 px-3">Remaining Balance</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {selectedLoan.schedule.map((item) => (
                    <tr key={item.installmentNumber} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.installmentNumber}</td>
                      <td className="py-2.5 px-3">{item.dueDate}</td>
                      <td className="py-2.5 px-3">{formatKES(item.principalDue)}</td>
                      <td className="py-2.5 px-3">{formatKES(item.interestDue)}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{formatKES(item.totalDue)}</td>
                      <td className="py-2.5 px-3 text-emerald-700">{formatKES(item.paidAmount)}</td>
                      <td className="py-2.5 px-3">{formatKES(item.balance)}</td>
                      <td className="py-2.5 px-3 font-sans">
                        {item.status === 'PAID' && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Paid</span>
                        )}
                        {item.status === 'OVERDUE' && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Overdue</span>
                        )}
                        {item.status === 'PENDING' && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Maturity Date: <strong>{selectedLoan.maturityDate}</strong> ({selectedLoan.termMonths} Months)
              </span>
              <button
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
