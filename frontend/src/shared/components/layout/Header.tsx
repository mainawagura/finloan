import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, RoleName } from '../../../app/security/constants/roles';
import {
  Search,
  FileSpreadsheet,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Shield,
  ChevronDown,
  RefreshCw,
  Clock,
  Laptop,
} from 'lucide-react';
import { useNavigate } from '../../../app/router/router';
import { GenerateReportModal } from '../../../features/reports/components/GenerateReportModal';

export const Header: React.FC<{
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}> = () => {
  const { userContext, currentRole, switchPersona, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentRoleDef = currentRole ? ROLES[currentRole] : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate('/customers');
  };

  const userInitials = userContext?.user.displayName
    ? userContext.user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'FL';

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 shrink-0">
        <div className="h-full px-5 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900 tracking-tight text-lg leading-tight flex items-center gap-1.5">
                  FinLoan
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-none">
                  Lendgismo Platform
                </span>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar (Matching Reference Image) */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your workspace — borrowers, applications, accounts..."
                className="w-full pl-9 pr-12 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </span>
            </form>
          </div>

          {/* Right Action Icons & User Controls */}
          <div className="flex items-center gap-2.5">
            {/* Generate Report Primary Header Action */}
            <button
              onClick={() => setShowReportModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 shadow-2xs transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
              <span>Generate Report</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {/* Settings Gear */}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Institution Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Help Icon */}
            <button
              onClick={() => navigate('/help')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition hidden sm:flex"
              title="System Help & Documentation"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

            {/* User Profile & Account Menu */}
            {isAuthenticated && userContext ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 hover:bg-slate-100 rounded-xl transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {userInitials}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {userContext.user.displayName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {currentRoleDef?.name || 'User'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{userContext.user.displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{userContext.user.email}</p>
                      {currentRoleDef && (
                        <div className="mt-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleDef.badgeColor}`}>
                            Role: {currentRoleDef.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Role Switcher in User Menu */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Switch Active Role:
                      </span>
                      <select
                        value={currentRole || ''}
                        onChange={(e) => {
                          switchPersona(e.target.value as RoleName);
                          setShowProfileMenu(false);
                        }}
                        className="w-full py-1 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-700"
                      >
                        {Object.values(ROLES).map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name} ({r.displayName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/sessions');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        <span>Active Sessions & Devices</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/audit');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>Security Audit Logs</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Generate Report Modal Dialog */}
      <GenerateReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </>
  );
};
