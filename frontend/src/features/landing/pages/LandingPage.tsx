import React from 'react';
import { useNavigate, Link } from '../../../app/router/router';
import { useAuth } from '../../../shared/hooks/useAuth';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileCheck,
  DollarSign,
  TrendingUp,
  BarChart3,
  Layers,
  Users,
  Building2,
  Laptop,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, userContext } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                FinLoan
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block leading-none">
                Lendgismo Enterprise Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#solutions" className="hover:text-white transition">Lending Lifecycle</a>
            <a href="#governance" className="hover:text-white transition">Maker-Checker</a>
            <a href="#security" className="hover:text-white transition">Security Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition"
              >
                <span>Open Staff Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition"
                >
                  <span>Access Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Generation Core Lending Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            The Operating System for Modern <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Lending Institutions</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Automate origination, enforce strict maker-checker credit governance, execute multi-channel disbursements, and reconcile repayments with mathematical precision.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              <span>Launch Operations Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm rounded-xl transition"
            >
              <span>Sign In with Workstation</span>
            </button>
          </div>

          {/* Interactive Live Dashboard Mock Preview */}
          <div className="mt-16 max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">FinLoan Live Portfolio</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ● Active Production
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Commercial banking & SME microfinance operations</p>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Total Portfolio:</span>
                    <strong className="text-white font-bold text-sm">KES 2,450,000.00</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Outstanding Principal:</span>
                    <strong className="text-blue-400 font-bold text-sm">KES 1,925,000.00</strong>
                  </div>
                </div>
              </div>

              {/* 4 Live Metric Pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Portfolio Value</span>
                  <strong className="text-lg font-mono font-bold text-emerald-400">KES 2.45M</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">4 Active Facilities</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Collections Rate</span>
                  <strong className="text-lg font-mono font-bold text-blue-400">93.2%</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Yield 8.2% APR</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Pending Review</span>
                  <strong className="text-lg font-mono font-bold text-amber-400">12 Apps</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Underwriting queue</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Portfolio at Risk (PAR)</span>
                  <strong className="text-lg font-mono font-bold text-rose-400">3.2%</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Institutional safe zone</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Click below to enter the live operations management dashboard with real-time reactive state.
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                >
                  Enter Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Financial Metrics Strip */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">KES 2.45M</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Active Loan Portfolio</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">93.2%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Collections Yield</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">3.2%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Portfolio at Risk (PAR)</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Immutable Audit Trail</div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Full Lending Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Everything Needed to Run an Institutional Credit Organization
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Engineered specifically for commercial banks, SACCOs, microfinance institutions, and digital credit operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Automated KYC & Customer Profiles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized registry for individual and commercial borrowers. Track identification, employment, next of kin, and total credit exposure with verifiable KYC workflows.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Maker-Checker Governance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Separation of duties enforced at the architectural level. Loan officers originate facilities, while credit managers independently underwrite and sign off. Self-approval is rejected.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Treasury & Multi-Channel Payouts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Net capital release with automatic fee deductions. Disburse via Fedwire, RTGS, Safaricom M-Pesa B2C, or ACH with instant creation of amortization schedules.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Waterfall Repayments & Reversals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intelligent allocation engine posting payments to penalties, interest, and principal in strict order. Controlled reversals preserve immutable ledger records without deletion.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Recovery & PAR Delinquency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor Portfolio at Risk buckets (PAR 30, PAR 60, PAR 90+). Assign recovery officers, log debtor engagements, and record formal promises-to-pay (PTP).
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Enterprise Security & Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                OWASP ASVS-compliant server-side sessions, sliding inactivity timeouts, cryptographic SHA-256 audit chaining, and granular role-based policy gates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Streamline Your Lending Portfolio?
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Access the institutional portal now to inspect loan accounts, execute credit assessment, or configure loan products.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-500/30 transition"
            >
              Enter FinLoan Portal
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-300">FinLoan Enterprise Core</span>
            <span>• Built for Financial Institutions, SACCOs & Microfinance</span>
          </div>
          <div>
            <span>© 2026 FinLoan Systems. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
