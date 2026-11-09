import React, { useState, useEffect } from 'react';
import { loanStore, LoanProduct } from '../../../services/api/loanManagementStore';
import {
  Layers,
  Plus,
  Percent,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Edit,
} from 'lucide-react';

export const LoanProductsPage: React.FC = () => {
  const [products, setProducts] = useState<LoanProduct[]>(loanStore.getProducts());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<LoanProduct['category']>('SME');
  const [minAmount, setMinAmount] = useState(5000);
  const [maxAmount, setMaxAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [calculationMethod, setCalculationMethod] = useState<'REDUCING_BALANCE' | 'FLAT_RATE'>('REDUCING_BALANCE');
  const [minTermMonths, setMinTermMonths] = useState(6);
  const [maxTermMonths, setMaxTermMonths] = useState(36);
  const [repaymentFrequency, setRepaymentFrequency] = useState<'MONTHLY' | 'WEEKLY'>('MONTHLY');
  const [processingFeePercent, setProcessingFeePercent] = useState(2.0);
  const [insuranceFeePercent, setInsuranceFeePercent] = useState(0.75);
  const [penaltyRatePercent, setPenaltyRatePercent] = useState(2.5);
  const [gracePeriodDays, setGracePeriodDays] = useState(14);
  const [collateralRequired, setCollateralRequired] = useState(true);
  const [guarantorRequired, setGuarantorRequired] = useState(true);
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    return loanStore.subscribe(() => {
      setProducts(loanStore.getProducts());
    });
  }, []);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    loanStore.addProduct({
      code,
      name,
      category,
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
      interestRate: Number(interestRate),
      calculationMethod,
      minTermMonths: Number(minTermMonths),
      maxTermMonths: Number(maxTermMonths),
      repaymentFrequency,
      processingFeePercent: Number(processingFeePercent),
      insuranceFeePercent: Number(insuranceFeePercent),
      penaltyRatePercent: Number(penaltyRatePercent),
      gracePeriodDays: Number(gracePeriodDays),
      collateralRequired,
      guarantorRequired,
      eligibilityCriteria: eligibilityCriteria || 'Standard credit criteria and positive credit score.',
      status: 'ACTIVE',
      description,
    });

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setDescription('');
    setEligibilityCriteria('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Module 4.3 Credit Facilities
            </span>
            <span className="text-xs text-slate-400">{products.length} Products Configured</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Products Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure lending tiers, reducing balance vs flat interest rates, fee matrices, and collateral rules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Configure New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {p.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <button
                  onClick={() => loanStore.toggleProductStatus(p.id)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                  title="Toggle product availability"
                >
                  {p.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{p.name}</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{p.description}</p>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Annual Interest Rate:</span>
                  <strong className="text-blue-700 text-sm font-mono">{p.interestRate}% APR</strong>
                  <span className="text-[10px] text-slate-500 block">
                    ({p.calculationMethod === 'REDUCING_BALANCE' ? 'Reducing Balance' : 'Flat Rate'})
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Loan Amount Range:</span>
                  <strong className="text-slate-900 font-mono">
                    KES {p.minAmount.toLocaleString()} – KES {p.maxAmount.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-slate-500 block">{p.repaymentFrequency} Installments</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Repayment Term:</span>
                  <strong className="text-slate-900">{p.minTermMonths} to {p.maxTermMonths} Months</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Grace Period:</span>
                  <strong className="text-slate-900">{p.gracePeriodDays} Days</strong>
                </div>
              </div>

              {/* Fee and Risk Requirements Matrix */}
              <div className="space-y-1.5 text-[11px] text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Origination Processing Fee:</span>
                  <strong className="text-slate-900">{p.processingFeePercent}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mandatory Credit Insurance:</span>
                  <strong className="text-slate-900">{p.insuranceFeePercent}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Late Repayment Penalty Rate:</span>
                  <strong className="text-rose-600">{p.penaltyRatePercent}% / month</strong>
                </div>
                <div className="flex justify-between">
                  <span>Security & Collateral:</span>
                  <strong className="text-slate-900">{p.collateralRequired ? 'Required' : 'Optional / Unsecured'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Personal Guarantor:</span>
                  <strong className="text-slate-900">{p.guarantorRequired ? 'Mandatory' : 'Not Required'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-xs text-[11px] italic" title={p.eligibilityCriteria}>
                Criteria: {p.eligibilityCriteria}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Configure Loan Facility (Module 4.3)</h3>
                <p className="text-xs text-slate-300 mt-0.5">Define lending parameters, interest structures and criteria</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AGRI-GRAIN"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="SME">SME Commercial</option>
                    <option value="INDIVIDUAL">Individual Consumer</option>
                    <option value="ASSET">Asset Financing</option>
                    <option value="AGRICULTURE">Agri-Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grain Harvest Input Loan"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Min Principal (KES)</label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Principal (KES)</label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Calculation Method</label>
                  <select
                    value={calculationMethod}
                    onChange={(e) => setCalculationMethod(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="REDUCING_BALANCE">Reducing Balance (Standard)</option>
                    <option value="FLAT_RATE">Flat Rate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Min Term (Months)</label>
                  <input
                    type="number"
                    value={minTermMonths}
                    onChange={(e) => setMinTermMonths(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Term (Months)</label>
                  <input
                    type="number"
                    value={maxTermMonths}
                    onChange={(e) => setMaxTermMonths(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Processing Fee %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={processingFeePercent}
                    onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Insurance Fee %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={insuranceFeePercent}
                    onChange={(e) => setInsuranceFeePercent(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Late Penalty %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={penaltyRatePercent}
                    onChange={(e) => setPenaltyRatePercent(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collateralRequired}
                    onChange={(e) => setCollateralRequired(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Requires Collateral Security</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={guarantorRequired}
                    onChange={(e) => setGuarantorRequired(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Requires Personal Guarantor</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Facility summary and target borrower description..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
