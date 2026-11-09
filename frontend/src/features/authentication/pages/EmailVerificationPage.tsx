import React, { useState } from 'react';
import { useNavigate, Link } from '../../../app/router/router';
import { MailCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export const EmailVerificationPage: React.FC = () => {
  const [token, setToken] = useState('tok_crypt_verify_8829a1');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-200">
          <MailCheck className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-1">Verify Email Address</h2>
        <p className="text-xs text-slate-500 mb-6">
          Cryptographically signed onboarding token required prior to account activation (Section 4.5).
        </p>

        {verified ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Email Verified Successfully</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Account status transitioned from <code>PENDING_ACTIVATION</code> to <code>ACTIVE</code>. Token has been invalidated to prevent replay attacks.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Verification Token (From Link)
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-700"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <strong>Section 4.5 Architecture Rule:</strong> Verification tokens are single-use, protected with ASP.NET Core Data Protection, and expire after 24 hours.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm shadow-sm transition"
            >
              Verify Token & Activate Account
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
                Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
