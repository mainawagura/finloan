import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { ROLES } from '../../app/security/constants/roles';
import { PERMISSION_DEFINITIONS } from '../../app/security/constants/permissions';
import { loanStore } from '../../services/api/loanManagementStore';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck,
  Laptop,
  History,
  Users,
  Grid,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Percent,
  Clock,
  Layers,
  Activity,
  Calendar,
  Send,
  Plus,
} from 'lucide-react';
import { Link, useNavigate } from '../../app/router/router';

export const DashboardPage: React.FC = () => {
  const { currentRole, userContext, isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState(loanStore.getDashboardMetrics());
  const [dashboardTab, setDashboardTab] = useState<'EXECUTIVE' | 'SECURITY'>('EXECUTIVE');
  const navigate = useNavigate();

  useEffect(() => {
    return loanStore.subscribe(() => {
      setMetrics(loanStore.getDashboardMetrics());
    });
  }, []);

  const roleDef = currentRole ? ROLES[currentRole] : null;
  const grantedPermissions = userContext?.permissions || [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Mode Switcher Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Enterprise Dashboard
            </span>
            <span className="text-xs text-slate-400">
              Thursday, March 26, 2026 • 10:07 AM
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAuthenticated ? `Welcome back, ${userContext?.user.displayName}` : 'FinLoan Enterprise Management'}
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Here's your institutional portfolio performance and regulatory overview today.
          </p>
        </div>

        {/* Dashboard Tab Selector */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setDashboardTab('EXECUTIVE')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                dashboardTab === 'EXECUTIVE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Executive Portfolio
            </button>
            <button
              onClick={() => setDashboardTab('SECURITY')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                dashboardTab === 'SECURITY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security Principal & RBAC
            </button>
          </div>

          <button
            onClick={() => navigate('/loan-applications')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {dashboardTab === 'EXECUTIVE' && (
        <>
          {/* Top Key Performance Indicators Banner (Matching Acme/Lendgismo Reference) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 block mb-1">Total Portfolio Value</span>
              <strong className="text-lg font-black text-slate-900 font-mono">KES 2,450,000.00</strong>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 block mb-1">Outstanding Principal</span>
              <strong className="text-lg font-black text-blue-700 font-mono">KES 1,925,000.00</strong>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 block mb-1">Current Yield</span>
              <strong className="text-lg font-black text-slate-900 font-mono">8.2%</strong>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 block mb-1">Collections Rate</span>
              <strong className="text-lg font-black text-emerald-600 font-mono">93.2%</strong>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 block mb-1">Delinquency (PAR)</span>
              <strong className="text-lg font-black text-rose-600 font-mono">3.2%</strong>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 block mb-1">Avg Days Past Due</span>
              <strong className="text-lg font-black text-amber-600 font-mono">6.1</strong>
            </div>
          </div>

          {/* 4 Feature Cards (Portfolio Value, Active Loans, Pending Review, Approval Rate) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Portfolio Value */}
            <div className="bg-white rounded-2xl border-t-4 border-emerald-500 border-slate-200 border p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Portfolio Value
                  </span>
                  <div className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-xs">
                    KES
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 font-mono">KES 2.45M</div>
                {/* Simulated sparkline curve */}
                <div className="h-8 my-2 flex items-end">
                  <svg className="w-full h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
                    <path d="M0,20 Q25,12 50,16 T100,6" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> Live
                </span>
                <span>4 Active • Today</span>
              </div>
            </div>

            {/* 2. Active Loans */}
            <div className="bg-white rounded-2xl border-t-4 border-blue-500 border-slate-200 border p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Active Loans
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {metrics.totalActiveLoansCount}
                </div>
                <div className="h-8 my-2 flex items-end">
                  <svg className="w-full h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
                    <path d="M0,18 Q20,15 40,16 T80,10 T100,8" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 3" />
                  </svg>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" /> Live
                </span>
                <span>Avg loan: KES 55K</span>
              </div>
            </div>

            {/* 3. Pending Review */}
            <div className="bg-white rounded-2xl border-t-4 border-amber-500 border-slate-200 border p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pending Review
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 font-mono">12</div>
                <div className="h-8 my-2 flex items-end">
                  <svg className="w-full h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
                    <path d="M0,14 Q30,10 60,18 T100,12" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-amber-700 font-semibold">Underwriting queue</span>
                <span>Pipeline velocity</span>
              </div>
            </div>

            {/* 4. Approval Rate */}
            <div className="bg-white rounded-2xl border-t-4 border-purple-500 border-slate-200 border p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Approval Rate
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 font-mono">78.5%</div>
                <div className="h-8 my-2 flex items-end">
                  <svg className="w-full h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
                    <path d="M0,10 Q40,10 70,11 T100,11" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-purple-700 font-semibold">Quality balance</span>
                <span>Risk tolerance</span>
              </div>
            </div>
          </div>

          {/* Cashflow Originations vs Repayments & Loan Pipeline (Matching Reference) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Originations vs Repayments Chart Component */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Originations vs Repayments</h3>
                    <p className="text-xs text-slate-500">Today • Portfolio cash flow analysis</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Originations KES 35,000
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Repayments KES 30,000
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Net Cash Flow</span>
                    <strong className="text-rose-600 font-mono text-sm">-KES 53,000</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Approval Rate</span>
                    <strong className="text-slate-900 font-mono text-sm">68.3%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Prepayment</span>
                    <strong className="text-slate-900 font-mono text-sm">18.2%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Delinquency</span>
                    <strong className="text-rose-600 font-mono text-sm">8.0%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Originations YTD</span>
                    <strong className="text-slate-900 font-mono text-sm">KES 278,000</strong>
                  </div>
                </div>

                {/* SVG Area Cashflow Chart */}
                <div className="h-44 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="origGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,130 C80,110 160,80 240,95 C320,110 400,60 500,40 L500,150 L0,150 Z"
                      fill="url(#origGrad)"
                    />
                    <path
                      d="M0,130 C80,110 160,80 240,95 C320,110 400,60 500,40"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M0,140 C80,135 160,115 240,120 C320,125 400,90 500,70 L500,150 L0,150 Z"
                      fill="url(#repGrad)"
                    />
                    <path
                      d="M0,140 C80,135 160,115 240,120 C320,125 400,90 500,70"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">Interval: 12-Month Liquidity Forecast</span>
                <Link to="/reports" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Detailed Treasury Breakdown →
                </Link>
              </div>
            </div>

            {/* Loan Pipeline Card (Matching Reference) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Loan Pipeline</h3>
                <p className="text-xs text-slate-500 mb-4">Health of your application flow</p>

                <div className="space-y-4">
                  {/* Step 1: New Applications */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">New Applications</span>
                      <strong className="text-slate-900 font-mono">36</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Under Review</span>
                      <strong className="text-slate-900 font-mono">18</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>

                  {/* Step 3: Approved */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Approved</span>
                      <strong className="text-slate-900 font-mono">12</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '33%' }} />
                    </div>
                  </div>

                  {/* Step 4: Funded / Disbursed */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Funded / Active</span>
                      <strong className="text-slate-900 font-mono">9</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/loan-approvals"
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
                >
                  <span>Review Approvals Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Security Architecture & Active Principal Overview Tab */}
      {dashboardTab === 'SECURITY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Role-Based Access Policy Evaluation for {roleDef?.displayName || 'Guest'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live status of all 17 discrete capabilities. Test different roles via the top toolbar.
                </p>
              </div>
              <Link
                to="/roles"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Full Role Matrix</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PERMISSION_DEFINITIONS.map((perm) => {
                const hasAccess = grantedPermissions.includes(perm.id);
                return (
                  <div
                    key={perm.id}
                    className={`p-3 rounded-xl border transition ${
                      hasAccess
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">{perm.id}</span>
                      {hasAccess ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Denied
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-700">{perm.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{perm.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
