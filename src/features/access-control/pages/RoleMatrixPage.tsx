import React from 'react';
import { ROLES } from '../../../app/security/constants/roles';
import { PERMISSION_DEFINITIONS } from '../../../app/security/constants/permissions';
import { Check, Minus, ShieldAlert, Info } from 'lucide-react';

export const RoleMatrixPage: React.FC = () => {
  const roles = Object.values(ROLES);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Role & Permission Matrix (Section 6.2 & 6.3)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete architectural mapping of all 7 institutional roles against 17 discrete application capabilities.
          </p>
        </div>
      </div>

      {/* Separation of Duties Architectural Callout */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950 text-sm mb-1">
            Section 6.2 & 7.2 Separation of Duties Enforcement
          </h4>
          <p className="text-amber-800 leading-relaxed">
            Note that <code>SUPER_ADMIN</code> explicitly does <strong>not</strong> possess the <code>loans.approve</code> or <code>loans.reject</code> permissions. Credit assessment and approvals are reserved strictly for <code>CREDIT_MANAGER</code> (the independent checker), preventing administrative self-approval of financial facilities.
          </p>
        </div>
      </div>

      {/* The Big Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider sticky left-0 bg-slate-900 z-10 w-72">
                  Permission / Capability
                </th>
                {roles.map((r) => (
                  <th key={r.name} className="py-3 px-3 text-center text-[10px] font-bold uppercase tracking-wider min-w-[110px]">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSION_DEFINITIONS.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-xs">
                    <p className="font-mono font-bold text-slate-900 text-xs">{perm.id}</p>
                    <p className="text-[11px] text-slate-500">{perm.name}</p>
                  </td>
                  {roles.map((r) => {
                    const hasPerm = r.permissions.includes(perm.id);
                    return (
                      <td key={r.name} className="py-3 px-3 text-center">
                        {hasPerm ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300 mx-auto">
                            <Minus className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
