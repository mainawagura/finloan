import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { PermissionValue } from './constants/permissions';
import { useNavigate } from '../router/router';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  permission?: PermissionValue | PermissionValue[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  children,
}) => {
  const { isAuthenticated, hasPermission, userContext } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600 text-sm mb-6">
            You must be authenticated with a valid server session to access this resource.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (permission && !hasPermission(permission)) {
    const requiredPermissions = Array.isArray(permission) ? permission.join(', ') : permission;
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-rose-100 p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-rose-100 text-rose-800 rounded-full">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">Access Denied</h2>
          <p className="text-slate-600 text-sm mb-4">
            Your current assigned role ({userContext?.roles.join(', ')}) lacks the required authorization policy to view this resource.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg text-left text-xs font-mono text-slate-700 mb-6 border border-slate-200">
            <p className="font-semibold text-slate-900 mb-1">Required Permission Policy:</p>
            <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">
              {requiredPermissions}
            </code>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
