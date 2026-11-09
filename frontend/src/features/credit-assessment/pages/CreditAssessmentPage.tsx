import React, { useState, useEffect } from 'react';
import { loanStore, LoanApplication } from '../../../services/api/loanManagementStore';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useNavigate } from '../../../app/router/router';
import { formatKES } from '../../../shared/utilities/currency';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Percent,
  DollarSign,
  User,
  Scale,
  Award,
} from 'lucide-react';

export const CreditAssessmentPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>(
    loanStore.getApplications().filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW')
  );
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [recommendedRisk, setRecommendedRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { userContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return loanStore.subscribe(() => {
      const active = loanStore
        .getApplications()
        .filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW');
      setApplications(active);
      if (!selectedAppId && active[0]) setSelectedAppId(active[0].id);
    });
  }, [selectedAppId]);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handleForwardToApproval = () => {
    if (!selectedApp) return;
    loanStore.updateApplicationStatus(
      selectedApp.id,
      'UNDER_REVIEW',
      `Credit assessment completed by ${userContext?.user.displayName || 'Credit Risk Officer'}. Risk Rating: ${recommendedRisk}. ${assessmentNotes}`
    );
    setFeedback(`Application ${selectedApp.applicationNumber} forwarded to independent Credit Manager approval queue.`);
  };

  const customer = selectedApp ? loanStore.getCustomerById(selectedApp.customerId) : null;
  const existingLoans = customer ? loanStore.getLoanAccounts().filter((l) => l.customerId === customer.id) : [];
  const totalExistingDebt = existingLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);

  // Financial Affordability Metrics
  const income = selectedApp?.monthlyIncome || 10000;
  const expenses = selectedApp?.monthlyExpenses || 4000;
  const disposableSurplus = income - expenses;
  const estInstallment = selectedApp ? (selectedApp.requestedAmount * 1.15) / selectedApp.termMonths : 1500;
  const coverageRatio = parseFloat((disposableSurplus / estInstallment).toFixed(2));
  const collateralCoverage = selectedApp?.collateralValue && selectedApp.requestedAmount > 0
    ? Math.round((selectedApp.collateralValue / selectedApp.requestedAmount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              Module 4.5 Underwriting & Risk Analysis
            </span>
            <span className="text-xs text-slate-400">{applications.length} Applications Pending Assessment</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Credit Assessment Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Independent affordability index, debt-to-income (DTI) computation, and risk scoring prior to approval queue.
          </p>
        </div>

        <button
          onClick={() => navigate('/loan-approvals')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-sm transition"
        >
          <span>Go to Approvals Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Underwriting Queue Clear</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All submitted loan applications have been assessed or forwarded to the maker-checker approval queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Queue Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Pending Assessment ({applications.length})
            </h3>
            <div className="space-y-2">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedApp?.id === app.id
                      ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900 text-xs">{app.applicationNumber}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {formatKES(app.requestedAmount)}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-xs truncate">{app.customerName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{app.productName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Underwriting Analysis Detail (2 Cols) */}
          {selectedApp && (
            <div className="lg:col-span-2 space-y-5">
              {/* Application Snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-base">{selectedApp.applicationNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {selectedApp.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedApp.customerName}</h3>
                    <p className="text-xs text-slate-500">{selectedApp.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{formatKES(selectedApp.requestedAmount)}</span>
                    <p className="text-xs text-slate-400">{selectedApp.termMonths} Months Term</p>
                  </div>
                </div>

                {/* Quantitative Credit Scores & Affordability */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Bureau Score</span>
                    <strong className="text-base font-mono font-bold text-slate-900">{selectedApp.creditScore}</strong>
                    <span className="text-[10px] text-emerald-600 block">Tier 1 Rating</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Debt-to-Income (DTI)</span>
                    <strong className={`text-base font-mono font-bold ${selectedApp.dtiRatio > 40 ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {selectedApp.dtiRatio}%
                    </strong>
                    <span className="text-[10px] text-slate-500 block">Threshold &lt; 45%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Disposable Coverage</span>
                    <strong className="text-base font-mono font-bold text-blue-700">{coverageRatio}x</strong>
                    <span className="text-[10px] text-slate-500 block">Min 1.25x req.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Collateral LTV</span>
                    <strong className="text-base font-mono font-bold text-indigo-700">
                      {collateralCoverage > 0 ? `${collateralCoverage}%` : 'Unsecured'}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">Asset Backing</span>
                  </div>
                </div>

                {/* Financial Balance Analysis */}
                <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-xl border border-slate-100 mb-5">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">Verified Monthly Revenue / Income:</span>
                    <strong className="text-slate-900 font-mono text-sm">{formatKES(income)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">Declared Monthly Operating Expenses:</span>
                    <strong className="text-slate-900 font-mono text-sm">{formatKES(expenses)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">Net Monthly Disposable Cashflow:</span>
                    <strong className="text-emerald-700 font-mono text-sm">{formatKES(disposableSurplus)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">Existing Institution Debt Exposure:</span>
                    <strong className="text-slate-900 font-mono text-sm">{formatKES(totalExistingDebt)}</strong>
                  </div>
                </div>

                {/* Collateral & Guarantor Assessment */}
                {selectedApp.collateralDescription && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs mb-5">
                    <span className="font-bold text-slate-900 text-xs block mb-1">Security / Collateral Assessment</span>
                    <p className="text-slate-700">{selectedApp.collateralDescription}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Assessed Forced Sale Value: <strong>{formatKES(selectedApp.collateralValue || 0)}</strong> ({collateralCoverage}% coverage of requested loan)
                    </p>
                  </div>
                )}

                {/* Recommendation & Officer Decision */}
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 uppercase tracking-wider text-[11px]">
                      Underwriter Risk Assessment & Recommendation
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-600 font-medium">Risk Rating:</span>
                      <select
                        value={recommendedRisk}
                        onChange={(e) => setRecommendedRisk(e.target.value as any)}
                        className="py-1 px-2 text-xs border border-purple-300 rounded-md bg-white font-bold"
                      >
                        <option value="LOW">LOW RISK</option>
                        <option value="MEDIUM">MEDIUM RISK</option>
                        <option value="HIGH">HIGH RISK</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    value={assessmentNotes}
                    onChange={(e) => setAssessmentNotes(e.target.value)}
                    rows={3}
                    placeholder="Document underwriting analysis, affordability verification, debt service coverage findings..."
                    className="w-full p-2.5 text-xs border border-purple-200 rounded-lg bg-white"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Per Section 4.5: Loans are not auto-approved by credit score.
                    </span>
                    <button
                      onClick={handleForwardToApproval}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-sm text-xs transition flex items-center gap-2"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Forward to Credit Manager Queue</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
