import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, RoleName } from '../../../app/security/constants/roles';
import { UserCheck, LogOut, Shield } from 'lucide-react';

export const DemoPersonaSwitcher: React.FC = () => {
  const { currentRole, switchPersona, logout, isAuthenticated } = useAuth();

  const roleList = Object.values(ROLES);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Switch Persona (Demo):</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {roleList.map((r) => {
            const isSelected = currentRole === r.name;
            return (
              <button
                key={r.name}
                onClick={() => switchPersona(r.name)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? `${r.color} font-semibold ring-2 ring-indigo-500/20 shadow-xs`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={r.description}
              >
                <Shield className="w-3 h-3" />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Simulate Unauthenticated (Guest)</span>
          </button>
        ) : (
          <span className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
            Current State: Unauthenticated
          </span>
        )}
      </div>
    </div>
  );
};
