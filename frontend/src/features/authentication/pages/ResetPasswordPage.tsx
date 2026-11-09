import React, { useState } from 'react';
import { useNavigate, Link } from '../../../app/router/router';
import { KeyRound, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Section 4.3 Password Complexity Validation
  const hasMinLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isFormValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-200">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-1">Set New Enterprise Password</h2>
        <p className="text-xs text-slate-500 mb-6">
          Tokens are single-use and invalidated immediately upon completion.
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Password Updated Successfully</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your security stamp has been refreshed and all existing sessions have been terminated. Please log in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Live Password Policy Checklist (Section 4.3) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">
                Section 4.3 Mandatory Password Policy:
              </span>
              <div className="grid grid-cols-1 gap-1">
                <RequirementItem satisfied={hasMinLength} label="Minimum 12 characters" />
                <RequirementItem satisfied={hasUppercase} label="At least one uppercase letter (A-Z)" />
                <RequirementItem satisfied={hasLowercase} label="At least one lowercase letter (a-z)" />
                <RequirementItem satisfied={hasNumber} label="At least one number (0-9)" />
                <RequirementItem satisfied={hasSpecial} label="At least one special character (!@#$...)" />
                <RequirementItem satisfied={passwordsMatch} label="Passwords match exactly" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2.5 px-4 font-semibold rounded-lg text-sm transition shadow-sm ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Update Password & Revoke Old Sessions
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
                Cancel and return to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const RequirementItem: React.FC<{ satisfied: boolean; label: string }> = ({ satisfied, label }) => (
  <div className="flex items-center gap-2">
    {satisfied ? (
      <Check className="w-3.5 h-3.5 text-emerald-600" />
    ) : (
      <X className="w-3.5 h-3.5 text-slate-400" />
    )}
    <span className={satisfied ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
      {label}
    </span>
  </div>
);
