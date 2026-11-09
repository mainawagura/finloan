import React from 'react';
import { useNavigate } from '../../../app/router/router';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Clock, ShieldAlert, ArrowRight, RotateCcw } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleReauthenticate = () => {
    login('SUPER_ADMIN');
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto my-12 text-center">
      <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-8">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
          <Clock className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 rounded-full">
          HTTP 401 Session Invalidation
        </span>

        <h1 className="text-2xl font-black text-slate-900 mt-4 mb-2">Session Expired</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Your authenticated server-side session was terminated in accordance with the FinLoan Enterprise Session Policy (Section 5.4).
        </p>

        <div className="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-700 mb-6 border border-slate-200 space-y-2">
          <p className="font-bold text-slate-900">Why did this happen?</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
            <li><strong>Inactivity Timeout:</strong> 15 minutes elapsed without client activity.</li>
            <li><strong>Absolute Lifetime:</strong> Maximum 8-hour continuous session boundary reached.</li>
            <li><strong>Remote Revocation:</strong> Session was invalidated by user or administrator.</li>
            <li><strong>Security Stamp Change:</strong> User password, MFA, or roles were updated.</li>
          </ul>
        </div>

        <button
          onClick={handleReauthenticate}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Re-authenticate Now</span>
        </button>
      </div>
    </div>
  );
};
