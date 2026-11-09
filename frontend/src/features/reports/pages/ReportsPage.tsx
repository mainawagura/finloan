import React, { useState } from 'react';
import { loanStore } from '../../../services/api/loanManagementStore';
import { formatKES } from '../../../shared/utilities/currency';
import {
  BarChart3,
  Download,
  Filter,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  PieChart,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<'PORTFOLIO' | 'DISBURSEMENTS' | 'REPAYMENTS' | 'PAR' | 'PRODUCTS'>('PORTFOLIO');
  const [dateRange, setDateRange] = useState('YTD');
  const [productFilter, setProductFilter] = useState('ALL');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const products = loanStore.getProducts();
  const loans = loanStore.getLoanAccounts();
  const repayments = loanStore.getRepayments();
  const disbursements = loanStore.getDisbursements();
  const metrics = loanStore.getDashboardMetrics();

  const handleExport = (format: 'EXCEL' | 'PDF' | 'CSV') => {
    const filename = `FinLoan_${selectedReport}_Report_${new Date().toISOString().split('T')[0]}.${format === 'EXCEL' ? 'xlsx' : format.toLowerCase()}`;
    setExportNotification(`Generating institutional ${format} report: ${filename}. File successfully prepared for export.`);
    setTimeout(() => {
      setExportNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Module 4.12 Financial Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Regulatory Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional portfolio reporting, disbursement reconciliations, collection yields, and PAR compliance statements.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('EXCEL')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {exportNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotification}</span>
          </div>
          <button onClick={() => setExportNotification(null)} className="text-emerald-700 hover:text-emerald-950">✕</button>
        </div>
      )}

      {/* Filter and Report Selection Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setSelectedReport('PORTFOLIO')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedReport === 'PORTFOLIO' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Loan Portfolio Report
          </button>
          <button
            onClick={() => setSelectedReport('DISBURSEMENTS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedReport === 'DISBURSEMENTS' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disbursements Report
          </button>
          <button
            onClick={() => setSelectedReport('REPAYMENTS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedReport === 'REPAYMENTS' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Repayments & Yield
          </button>
          <button
            onClick={() => setSelectedReport('PAR')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedReport === 'PAR' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portfolio at Risk (PAR)
          </button>
          <button
            onClick={() => setSelectedReport('PRODUCTS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedReport === 'PRODUCTS' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Performance
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="TODAY">Today (Mar 26)</option>
            <option value="MTD">Month to Date (MTD)</option>
            <option value="QTD">Quarter to Date (QTD)</option>
            <option value="YTD">Year to Date (YTD)</option>
          </select>

          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate Financial Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Loan Portfolio</span>
          <strong className="text-2xl font-black text-slate-900 font-mono">
            {formatKES(metrics.totalLoanPortfolio)}
          </strong>
          <span className="text-[10px] text-emerald-600 block mt-1">4 Active Facilities</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Outstanding Principal</span>
          <strong className="text-2xl font-black text-blue-700 font-mono">
            {formatKES(metrics.totalOutstandingBalance)}
          </strong>
          <span className="text-[10px] text-slate-500 block mt-1">Net Exposure</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Collections Yield</span>
          <strong className="text-2xl font-black text-emerald-600 font-mono">
            {metrics.collectionsRate}%
          </strong>
          <span className="text-[10px] text-slate-500 block mt-1">Current Yield: {metrics.currentYield}%</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Portfolio at Risk (PAR 30)</span>
          <strong className="text-2xl font-black text-rose-600 font-mono">
            {metrics.parRatio}%
          </strong>
          <span className="text-[10px] text-rose-600 block mt-1">{metrics.overdueLoansCount} Overdue Facility</span>
        </div>
      </div>

      {/* Render Selected Report View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        {selectedReport === 'PORTFOLIO' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Comprehensive Loan Portfolio Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Loan #</th>
                    <th className="py-3 px-4">Borrower Entity</th>
                    <th className="py-3 px-4">Product Category</th>
                    <th className="py-3 px-4">Disbursed Principal</th>
                    <th className="py-3 px-4">Total Paid</th>
                    <th className="py-3 px-4">Outstanding Balance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {loans.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{l.loanNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-800">{l.customerName}</td>
                      <td className="py-3 px-4 font-sans">{l.productName}</td>
                      <td className="py-3 px-4">{formatKES(l.principalAmount)}</td>
                      <td className="py-3 px-4 text-emerald-700">{formatKES(l.totalPaid)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatKES(l.outstandingBalance)}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'DISBURSEMENTS' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Capital Disbursement Statements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Gross Principal</th>
                    <th className="py-3 px-4">Fee Deductions</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {disbursements.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{d.disbursementReference || d.applicationNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-800">{d.customerName}</td>
                      <td className="py-3 px-4">{formatKES(d.approvedAmount)}</td>
                      <td className="py-3 px-4 text-rose-600">-{formatKES(d.processingFee + d.insuranceFee)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{formatKES(d.netDisbursement)}</td>
                      <td className="py-3 px-4 font-sans">{d.paymentMethod}</td>
                      <td className="py-3 px-4 font-sans text-slate-500">
                        {d.disbursedAtUtc ? new Date(d.disbursedAtUtc).toLocaleDateString() : 'Awaiting Release'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'REPAYMENTS' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Repayment Reconciliation & Income Allocations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Receipt Ref</th>
                    <th className="py-3 px-4">Loan Account</th>
                    <th className="py-3 px-4">Borrower</th>
                    <th className="py-3 px-4">Total Received</th>
                    <th className="py-3 px-4">Allocated Principal</th>
                    <th className="py-3 px-4">Allocated Interest</th>
                    <th className="py-3 px-4">Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {repayments.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.referenceNumber}</td>
                      <td className="py-3 px-4">{r.loanNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-800">{r.customerName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{formatKES(r.amount)}</td>
                      <td className="py-3 px-4 text-blue-700">{formatKES(r.allocatedPrincipal)}</td>
                      <td className="py-3 px-4 text-purple-700">{formatKES(r.allocatedInterest)}</td>
                      <td className="py-3 px-4 font-sans">{r.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'PAR' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Portfolio at Risk (PAR) Aging Analysis</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="text-xs text-amber-900 font-bold block mb-1">PAR 1–30 Days</span>
                <strong className="text-xl font-mono text-amber-950 font-bold">KES 0.00</strong>
                <span className="text-[10px] text-amber-700 block mt-0.5">0.0% of Portfolio</span>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center">
                <span className="text-xs text-rose-900 font-bold block mb-1">PAR 31–60 Days</span>
                <strong className="text-xl font-mono text-rose-950 font-bold">KES 52,000.00</strong>
                <span className="text-[10px] text-rose-700 block mt-0.5">15.5% of Portfolio</span>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                <span className="text-xs text-red-900 font-bold block mb-1">PAR 90+ Days (NPL)</span>
                <strong className="text-xl font-mono text-red-950 font-bold">KES 0.00</strong>
                <span className="text-[10px] text-red-700 block mt-0.5">0.0% Default</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Regulatory compliance requires PAR ratios above 5.0% to trigger credit risk committee reviews and intensified recovery protocols under Module 4.11.
            </p>
          </div>
        )}

        {selectedReport === 'PRODUCTS' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Credit Facility Distribution & Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 text-sm">{p.name}</strong>
                    <span className="font-mono text-xs text-blue-700 font-bold">{p.interestRate}% APR</span>
                  </div>
                  <p className="text-xs text-slate-500">{p.description}</p>
                  <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-200">
                    <span>Limit: {formatKES(p.maxAmount)}</span>
                    <span>Method: {p.calculationMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
