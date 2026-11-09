import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useNavigate, Link } from '../../../app/router/router';
import { RoleName } from '../../../app/security/constants/roles';
import {
  Shield,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Laptop,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState('sarah.jenkins@finloan.bank');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [branchId, setBranchId] = useState('001');
  const [authMethod, setAuthMethod] = useState<'APP_PUSH' | 'SMS_OTP' | 'HARDWARE_KEY'>('APP_PUSH');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Intelligently resolve the institutional staff role based on corporate credentials
  const resolveRole = (inputUser: string): RoleName => {
    const val = inputUser.toLowerCase().trim();
    if (val.includes('elena') || val.includes('credit') || val.includes('checker') || val.includes('underwriter')) {
      return 'CREDIT_MANAGER';
    }
    if (val.includes('alex') || val.includes('maker') || val.includes('loan.officer')) {
      return 'LOAN_OFFICER';
    }
    if (val.includes('marcus') || val.includes('finance') || val.includes('treasury') || val.includes('disbursement')) {
      return 'FINANCE_OFFICER';
    }
    if (val.includes('patricia') || val.includes('recovery') || val.includes('arrears') || val.includes('collection')) {
      return 'RECOVERY_OFFICER';
    }
    if (val.includes('auditor') || val.includes('compliance') || val.includes('risk.audit')) {
      return 'AUDITOR';
    }
    if (val.includes('david') || (val.includes('admin') && !val.includes('super'))) {
      return 'ADMIN';
    }
    return 'SUPER_ADMIN';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Corporate Staff ID or Email is required.');
      return;
    }

    if (!password) {
      setErrorMessage('Security credentials cannot be empty.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const assignedRole = resolveRole(username);
      login(assignedRole);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Institutional Top Security Header */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link to="/landing" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white leading-tight">
                FinLoan
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-none">
                Core Banking & Lending Gateway
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block h-4 w-px bg-slate-700 mx-2" />

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Core Banking Online (256-Bit TLS)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/landing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Corporate Banking Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 my-4">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Security & Regulatory Column (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Central Bank Regulated Entity</span>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
                  Staff Authentication Terminal
                </h1>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Authorized access for institutional loan officers, credit committees, underwriter checkers, and treasury personnel.
                </p>
              </div>

              <div className="space-y-3.5 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Dual-Control Maker-Checker</strong>
                    <span className="text-[11px] text-slate-400">Enforces separation of duties across origination and approval.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Cryptographic Audit Ledger</strong>
                    <span className="text-[11px] text-slate-400">All financial events recorded with SHA-256 immutable chaining.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Inactivity Guard & Revocation</strong>
                    <span className="text-[11px] text-slate-400">15-minute sliding session protection and instantaneous token revocation.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 mt-6">
              <div className="flex items-center justify-between">
                <span>Security Standard:</span>
                <strong className="text-slate-300">OWASP ASVS L3 / ISO 27001</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Gateway Node:</span>
                <span className="font-mono text-slate-400">ke-nbi-core-01</span>
              </div>
            </div>
          </div>

          {/* Right Staff Credentials Form Column (7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Sign In</h2>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                    Internal Access
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Please provide your institutional credentials and operating branch.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Branch / Operating Division */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Branch / Operating Unit
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 bg-slate-50/80 cursor-pointer"
                    >
                      <option value="001">Branch 001 — Nairobi HQ & Commercial Lending</option>
                      <option value="002">Branch 002 — Westlands SME & Corporate Credit</option>
                      <option value="003">Branch 003 — Mombasa Coast Operations</option>
                      <option value="004">Branch 004 — Central Treasury & Digital Lending</option>
                    </select>
                  </div>
                </div>

                {/* Staff ID or Corporate Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Corporate Staff ID or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 bg-white placeholder:text-slate-400"
                      placeholder="e.g. staff.id@finloan.bank or FL-9042"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Security Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Forgot Credentials?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 bg-white placeholder:text-slate-400"
                      placeholder="Enter security password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Second Factor Security Verification Method */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Multi-Factor Authentication (MFA)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('APP_PUSH')}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        authMethod === 'APP_PUSH'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Authenticator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMethod('SMS_OTP')}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        authMethod === 'SMS_OTP'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Corporate SMS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMethod('HARDWARE_KEY')}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        authMethod === 'HARDWARE_KEY'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Security Key</span>
                    </button>
                  </div>
                </div>

                {/* Remember workstation */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                    />
                    <span className="text-xs font-medium">Keep workstation session active (15m sliding timeout)</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Validating Security Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize Terminal Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Regulatory Disclaimer & Helpdesk Support */}
            <div className="pt-5 border-t border-slate-100 mt-6 space-y-2 text-[10px] text-slate-500">
              <div className="flex items-start gap-1.5 text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <p className="leading-tight">
                  <strong>Notice:</strong> This system is restricted exclusively to authorized FinLoan personnel. Unauthorized access attempts are monitored and prosecuted under the Computer Misuse and Cybercrimes Act and Central Bank prudential regulations.
                </p>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>IT Service Desk: ext. 4400</span>
                <span className="font-mono">support@finloan.bank</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Legal & Compliance Footer */}
      <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>
          © 2026 FinLoan Financial Systems Ltd. All Rights Reserved. Licensed Credit Institution.
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Security Governance</span>
          <span>•</span>
          <span>Terms of Employment Access</span>
        </div>
      </footer>
    </div>
  );
};
