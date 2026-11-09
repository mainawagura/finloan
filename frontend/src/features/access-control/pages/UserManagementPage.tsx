import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/api/authService';
import { ApplicationUserDto } from '../../../services/api/contracts';
import { ROLES, RoleName } from '../../../app/security/constants/roles';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Users, Shield, Edit2, CheckCircle2, Lock, AlertTriangle, Key } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ApplicationUserDto[]>([]);
  const [editingUser, setEditingUser] = useState<ApplicationUserDto | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>([]);
  const { currentRole } = useAuth();

  const loadUsers = async () => {
    const list = await authService.getUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openRoleEditor = (user: ApplicationUserDto) => {
    setEditingUser(user);
    setSelectedRoles([...user.roles]);
  };

  const handleRoleToggle = (role: RoleName) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const saveRoles = async () => {
    if (!editingUser) return;
    await authService.updateUserRoles(editingUser.id, selectedRoles, currentRole || 'SUPER_ADMIN');
    setEditingUser(null);
    await loadUsers();
  };

  const getStatusBadge = (status: ApplicationUserDto['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Active</span>;
      case 'LOCKED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Locked</span>;
      case 'SUSPENDED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">Suspended</span>;
      case 'PENDING_ACTIVATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Pending Activation</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Administration & Role Assignment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 6.4: Manage user security principals, role delegations, and account status lifecycle.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Assigned Roles</th>
                <th className="py-3.5 px-4">MFA Enrolled</th>
                <th className="py-3.5 px-4">Failed Logins</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{u.displayName}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                    <span className="font-mono text-[10px] text-slate-400">ID: {u.id}</span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.mfaEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono font-bold ${
                        u.failedLoginAttempts >= 5 ? 'text-rose-600' : 'text-slate-600'
                      }`}
                    >
                      {u.failedLoginAttempts} / 5
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {u.lastLoginAtUtc ? new Date(u.lastLoginAtUtc).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openRoleEditor(u)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Roles</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assign Roles: {editingUser.displayName}
                </h3>
                <p className="text-xs text-slate-500">{editingUser.email}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {Object.values(ROLES).map((r) => {
                const isChecked = selectedRoles.includes(r.name);
                return (
                  <label
                    key={r.name}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleRoleToggle(r.name)}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{r.name}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{r.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200">
              <strong>Audit Requirement (Section 8.2):</strong> All role modifications will be recorded with current operator identity and previous hash chaining.
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={saveRoles}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
              >
                Save Role Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
