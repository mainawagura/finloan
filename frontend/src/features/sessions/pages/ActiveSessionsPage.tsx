import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/api/authService';
import { UserSessionDto } from '../../../services/api/contracts';
import { useAuth } from '../../../shared/hooks/useAuth';
import {
  Laptop,
  Smartphone,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const ActiveSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionToRevoke, setSelectedSessionToRevoke] = useState<string | null>(null);
  const [showBulkRevokeModal, setShowBulkRevokeModal] = useState(false);
  const { logout } = useAuth();

  const loadSessions = async () => {
    setLoading(true);
    const data = await authService.getSessions();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (id: string) => {
    await authService.revokeSession(id);
    setSelectedSessionToRevoke(null);
    await loadSessions();
  };

  const handleRevokeAllOther = async () => {
    await authService.revokeAllOtherSessions();
    setShowBulkRevokeModal(false);
    await loadSessions();
  };

  const currentSession = sessions.find((s) => s.isCurrentSession);
  const otherSessions = sessions.filter((s) => !s.isCurrentSession);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Active Sessions Management (Section 5.6)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Server-managed authenticated sessions backed by SQL Server session store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSessions}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Refresh active session list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowBulkRevokeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Revoke All Other Sessions</span>
          </button>
        </div>
      </div>

      {/* Current Active Session Spotlight Card */}
      {currentSession && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-indigo-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{currentSession.deviceName}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                    This Current Device
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  {currentSession.browserName} • {currentSession.operatingSystem} • IP: {currentSession.ipAddress}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Current Session</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-indigo-300 block mb-0.5">Session Created:</span>
              <span className="font-semibold">{new Date(currentSession.createdAtUtc).toLocaleTimeString()}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-indigo-300 block mb-0.5">Last Activity:</span>
              <span className="font-semibold">{new Date(currentSession.lastActivityAtUtc).toLocaleTimeString()}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-indigo-300 block mb-0.5">Idle Inactivity Window:</span>
              <span className="font-semibold text-amber-300">15 Minutes Sliding</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-indigo-300 block mb-0.5">Absolute Expiration:</span>
              <span className="font-semibold text-emerald-300">8 Hours Hard Cap</span>
            </div>
          </div>
        </div>
      )}

      {/* Other Sessions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Other Registered Devices & Historical Sessions ({otherSessions.length})
        </h3>

        <div className="space-y-3">
          {otherSessions.map((s) => {
            const isMobile = s.operatingSystem.includes('iOS') || s.operatingSystem.includes('Android');
            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  s.isActive ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      s.isActive
                        ? 'bg-slate-100 text-slate-700 border-slate-300'
                        : 'bg-rose-50 text-rose-500 border-rose-200'
                    }`}
                  >
                    {isMobile ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{s.deviceName}</h4>
                      {s.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300">
                          Revoked / Expired
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.browserName} on {s.operatingSystem} • IP: <span className="font-mono">{s.ipAddress}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Created: {new Date(s.createdAtUtc).toLocaleString()} • Last active:{' '}
                      {new Date(s.lastActivityAtUtc).toLocaleTimeString()}
                    </p>
                    {s.revocationReason && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        Reason: {s.revocationReason}
                      </p>
                    )}
                  </div>
                </div>

                {s.isActive && (
                  <button
                    onClick={() => setSelectedSessionToRevoke(s.id)}
                    className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                  >
                    Revoke Session
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revoke Single Session Confirmation Modal */}
      {selectedSessionToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Revoke Authenticated Session?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action immediately writes an invalidation record to the central SQL session store and invalidates the session identifier hash. Any requests sent with this cookie will receive HTTP 401.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setSelectedSessionToRevoke(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevoke(selectedSessionToRevoke)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Revoke Modal */}
      {showBulkRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Revoke All Other Sessions?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All active sessions across other devices and browsers will be terminated instantly. Only your current browser session will remain active.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowBulkRevokeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeAllOther}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs"
              >
                Revoke All Others
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
