import React, { useState } from 'react';
import { loanStore } from '../../../services/api/loanManagementStore';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  X,
  Filter,
} from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('PORTFOLIO');
  const [dateRange, setDateRange] = useState('YTD');
  const [format, setFormat] = useState<'EXCEL' | 'PDF' | 'CSV'>('EXCEL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedSuccess(false);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setTimeout(() => {
        setGeneratedSuccess(false);
        onClose();
      }, 1800);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-400/30 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate Institutional Report</h3>
              <p className="text-[11px] text-slate-400">Export audited financial and portfolio data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PORTFOLIO">Loan Portfolio & Outstanding Balances Summary</option>
              <option value="DISBURSEMENTS">Capital Disbursements & Fee Deductions Statement</option>
              <option value="REPAYMENTS">Repayments Collections & Interest Yield Statement</option>
              <option value="PAR">Portfolio at Risk (PAR 30 / 60 / 90+ Aging)</option>
              <option value="DELINQUENCY">Delinquent Accounts & Recovery Progress Log</option>
              <option value="CUSTOMER">Customer Credit Exposure & KYC Register</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Reporting Period
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODAY">Today (Mar 26, 2026)</option>
                <option value="7D">Last 7 Days</option>
                <option value="MTD">Month to Date (MTD)</option>
                <option value="QTD">Quarter to Date (QTD)</option>
                <option value="YTD">Year to Date (YTD 2026)</option>
                <option value="ALL">Entire Historical Portfolio</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormat('EXCEL')}
                  className={`py-1.5 text-center rounded-lg font-bold transition text-[11px] ${
                    format === 'EXCEL' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('PDF')}
                  className={`py-1.5 text-center rounded-lg font-bold transition text-[11px] ${
                    format === 'PDF' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('CSV')}
                  className={`py-1.5 text-center rounded-lg font-bold transition text-[11px] ${
                    format === 'CSV' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CSV
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 text-[11px] block">Dataset Information:</span>
            <p className="text-[11px] leading-relaxed">
              Report will compile <strong>{loanStore.getLoanAccounts().length} active accounts</strong>,{' '}
              <strong>{loanStore.getRepayments().length} payment transactions</strong>, and current PAR delinquency metrics.
            </p>
          </div>

          {generatedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Report successfully compiled and ready! Download initiated.</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating File...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
