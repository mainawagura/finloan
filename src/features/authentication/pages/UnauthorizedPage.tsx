import React from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useNavigate, Link } from '../../../app/router/router';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { currentRole, userContext } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto my-12 text-center">
      <div className="bg-white rounded-2xl shadow-xl border border-rose-200 p-8">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 rounded-full">
          HTTP 403 Forbidden
        </span>

        <h1 className="text-2xl font-black text-slate-900 mt-4 mb-2">Access Denied</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          You are authenticated as <strong>{userContext?.user.displayName || 'Current User'}</strong> with role{' '}
          <code className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold border border-rose-200">
            {currentRole || 'UNKNOWN'}
          </code>
          , but your assigned permission profile does not satisfy the required authorization policy.
        </p>

        <div className="p-4 bg-slate-50 rounded-xl text-left text-xs font-mono text-slate-700 mb-6 border border-slate-200 space-y-2">
          <p className="font-semibold text-slate-900">Security Architecture Policy (Section 1.1 & 6.1):</p>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            • <strong>Deny-by-default:</strong> Authorization requires explicit permission grants.<br />
            • <strong>Separation of Duties:</strong> Certain operations (such as approving loans or disbursing capital) cannot be performed across conflicting roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
          <Link
            to="/roles"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition"
          >
            <span>Review Role Matrix</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
