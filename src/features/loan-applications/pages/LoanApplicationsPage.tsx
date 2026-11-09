import React, { useState, useEffect } from 'react';
import { loanStore, LoanApplication, Customer, LoanProduct } from '../../../services/api/loanManagementStore';
import { useAuth } from '../../../shared/hooks/useAuth';
import { PermissionGate } from '../../../app/security/PermissionGate';
import { PERMISSIONS } from '../../../app/security/constants/permissions';
import { formatKES } from '../../../shared/utilities/currency';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  User,
  Building2,
  Eye,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { useNavigate } from '../../../app/router/router';

export const LoanApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>(loanStore.getApplications());
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);

  const { userContext } = useAuth();
  const navigate = useNavigate();

  // New Application Form State
  const customers = loanStore.getCustomers();
  const products = loanStore.getProducts();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [requestedAmount, setRequestedAmount] = useState<number>(50000);
  const [termMonths, setTermMonths] = useState<number>(24);
  const [purpose, setPurpose] = useState('');
  const [collateralDesc, setCollateralDesc] = useState('');
  const [collateralVal, setCollateralVal] = useState<number>(75000);
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');

  useEffect(() => {
    return loanStore.subscribe(() => {
      setApplications(loanStore.getApplications());
      if (selectedApp) {
        setSelectedApp(loanStore.getApplicationById(selectedApp.id) || null);
      }
    });
  }, [selectedApp]);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Auto-calculated estimated installment & DTI ratio
  const monthlyIncome = selectedCustomer?.employment.monthlyIncome || 10000;
  const monthlyExpenses = selectedCustomer?.employment.monthlyExpenses || 4000;
  const rate = selectedProduct?.interestRate || 8.5;
  const totalInterest = requestedAmount * (rate / 100) * (termMonths / 12);
  const monthlyInstallment = (requestedAmount + totalInterest) / termMonths;
  const dtiRatio = parseFloat(((monthlyInstallment / monthlyIncome) * 100).toFixed(1));

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProduct) return;

    loanStore.createApplication({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerType: selectedCustomer.type,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      requestedAmount: Number(requestedAmount),
      termMonths: Number(termMonths),
      purpose: purpose || 'Commercial expansion and inventory financing',
      monthlyIncome,
      monthlyExpenses,
      dtiRatio,
      creditScore: selectedCustomer.type === 'BUSINESS' ? 785 : 720,
      riskRating: dtiRatio > 45 ? 'HIGH' : dtiRatio > 35 ? 'MEDIUM' : 'LOW',
      makerUserId: userContext?.user.id || 'usr-maker',
      makerName: userContext?.user.displayName || 'Alex Rivera (Loan Officer)',
      collateralDescription: collateralDesc,
      collateralValue: Number(collateralVal),
      guarantorName,
      guarantorPhone,
    });

    setShowNewAppModal(false);
  };

  const getStatusBadge = (status: LoanApplication['status']) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">Under Review</span>;
      case 'SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">Submitted</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Module 4.4 Origination Pipeline
            </span>
            <span className="text-xs text-slate-400">{applications.length} Applications Total</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Applications Workflow</h1>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end multi-step loan origination, debt-to-income pre-scoring, and maker submission.
          </p>
        </div>

        <PermissionGate
          permission={PERMISSIONS.LOANS_CREATE}
          fallback={
            <div className="text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
              New Application (Requires LOAN_OFFICER / loans.create)
            </div>
          }
        >
          <button
            onClick={() => setShowNewAppModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Loan Application (Maker)</span>
          </button>
        </PermissionGate>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by borrower or application number"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Application Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Application Details</th>
                <th className="py-3.5 px-4">Borrower</th>
                <th className="py-3.5 px-4">Loan Facility</th>
                <th className="py-3.5 px-4">Requested Principal</th>
                <th className="py-3.5 px-4">Term</th>
                <th className="py-3.5 px-4">DTI Ratio</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-slate-900">{app.applicationNumber}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Submitted {new Date(app.submittedAtUtc).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{app.customerName}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{app.customerType}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{app.productName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                    {formatKES(app.requestedAmount)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{app.termMonths} Mos</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono font-bold ${
                        app.dtiRatio > 40 ? 'text-amber-600' : 'text-emerald-700'
                      }`}
                    >
                      {app.dtiRatio}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {app.status === 'UNDER_REVIEW' && (
                        <button
                          onClick={() => navigate('/credit-assessment')}
                          className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                          title="Open Credit Assessment Workspace"
                        >
                          Assess
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Application Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{selectedApp.applicationNumber}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                    {selectedApp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Borrower: {selectedApp.customerName} ({selectedApp.customerType})
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Requested Principal:</span>
                  <strong className="text-base text-slate-900 font-mono">
                    {formatKES(selectedApp.requestedAmount)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Repayment Term:</span>
                  <strong className="text-base text-slate-900 font-mono">{selectedApp.termMonths} Months</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Credit Product:</span>
                  <span className="text-slate-900 font-semibold">{selectedApp.productName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Debt-to-Income (DTI):</span>
                  <span className="text-slate-900 font-mono font-bold">{selectedApp.dtiRatio}% (Score: {selectedApp.creditScore})</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold text-[11px] uppercase">
                  Borrower Stated Purpose:
                </span>
                <p className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {selectedApp.purpose}
                </p>
              </div>

              {selectedApp.collateralDescription && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-[11px] block mb-1">Declared Collateral Security</span>
                  <p className="text-slate-700">{selectedApp.collateralDescription}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Estimated Valuation: <strong>{formatKES(selectedApp.collateralValue || 0)}</strong>
                  </p>
                </div>
              )}

              {selectedApp.guarantorName && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-[11px] block mb-1">Personal Guarantor</span>
                  <p className="text-slate-700">{selectedApp.guarantorName} • Phone: {selectedApp.guarantorPhone}</p>
                </div>
              )}

              {/* Maker-Checker Audit Section */}
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 text-[11px] space-y-1.5">
                <span className="font-bold text-indigo-950 uppercase tracking-wider block">
                  Maker-Checker Governance Audit
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Originated By (Maker):</span>
                    <strong>{selectedApp.makerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reviewed By (Checker):</span>
                    <strong>{selectedApp.checkerName || 'Pending Independent Checker Review'}</strong>
                  </div>
                </div>
                {selectedApp.approvalNotes && (
                  <div className="pt-1 text-slate-800">
                    <strong>Checker Approval Notes:</strong> {selectedApp.approvalNotes}
                  </div>
                )}
                {selectedApp.rejectionReason && (
                  <div className="pt-1 text-rose-700">
                    <strong>Rejection Reason:</strong> {selectedApp.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">ID: {selectedApp.id}</span>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {showNewAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Initiate Loan Application (Maker)</h3>
                <p className="text-xs text-slate-300 mt-0.5">Submit credit request for independent underwriter review</p>
              </div>
              <button onClick={() => setShowNewAppModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateApplication} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Registered Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type}) — {c.customerNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Loan Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.interestRate}% APR • max KES {p.maxAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Requested Principal (KES)</label>
                  <input
                    type="number"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Repayment Term (Months)</label>
                  <input
                    type="number"
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Live Affordability Calculator Preview */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block">Est. Monthly Installment:</span>
                  <strong className="text-blue-900 font-mono text-sm">{formatKES(monthlyInstallment)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Projected Debt-to-Income (DTI):</span>
                  <strong className={`font-mono text-sm ${dtiRatio > 40 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {dtiRatio}% ({dtiRatio > 40 ? 'Moderate Risk' : 'Acceptable'})
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Specific Purpose of Borrowing</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  required
                  placeholder="e.g. Working capital line to finance purchase orders..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-[11px] block">Collateral Security & Guarantor</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Collateral Asset Description</label>
                    <input
                      type="text"
                      value={collateralDesc}
                      onChange={(e) => setCollateralDesc(e.target.value)}
                      placeholder="e.g. Motor Vehicle Logbook or Land Title"
                      className="w-full p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Estimated Asset Value (KES)</label>
                    <input
                      type="number"
                      value={collateralVal}
                      onChange={(e) => setCollateralVal(Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Guarantor Full Name</label>
                    <input
                      type="text"
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      placeholder="e.g. Samuel Mutiso"
                      className="w-full p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Guarantor Phone</label>
                    <input
                      type="tel"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAppModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Submit for Underwriting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
