import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS, PermissionValue } from '../../../app/security/constants/permissions';
import { usePathname, Link } from '../../../app/router/router';
import {
  LayoutDashboard,
  Users,
  Layers,
  FileText,
  FileCheck,
  CheckCircle2,
  Send,
  BookOpen,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Laptop,
  ShieldCheck,
  History,
  Grid,
  KeyRound,
  Lock,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  UserCheck,
} from 'lucide-react';

interface SubItem {
  label: string;
  path: string;
  permission?: PermissionValue;
  badge?: string;
}

interface ModuleGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  items: SubItem[];
}

export const Sidebar: React.FC<{
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ isCollapsed, onToggleCollapse }) => {
  const { hasPermission, isAuthenticated } = useAuth();
  const currentPath = usePathname();

  // Expanded sub-module accordions state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    borrowers: true,
    origination: true,
    servicing: true,
    reports: true,
    security: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const moduleGroups: ModuleGroup[] = [
    {
      id: 'borrowers',
      title: 'Borrowers & KYC',
      icon: Users,
      defaultOpen: true,
      items: [
        { label: 'Customer Management', path: '/customers', permission: PERMISSIONS.CUSTOMERS_VIEW },
      ],
    },
    {
      id: 'origination',
      title: 'Credit & Origination',
      icon: FileText,
      defaultOpen: true,
      items: [
        { label: 'Loan Products', path: '/loan-products' },
        { label: 'Loan Applications', path: '/loan-applications', permission: PERMISSIONS.LOANS_VIEW },
        { label: 'Credit Assessment', path: '/credit-assessment', permission: PERMISSIONS.LOANS_VIEW },
        { label: 'Loan Approvals', path: '/loan-approvals', permission: PERMISSIONS.LOANS_VIEW, badge: 'Checker' },
      ],
    },
    {
      id: 'servicing',
      title: 'Servicing & Treasury',
      icon: DollarSign,
      defaultOpen: true,
      items: [
        { label: 'Disbursements Queue', path: '/disbursements', permission: PERMISSIONS.LOANS_VIEW },
        { label: 'Loan Accounts & Ledgers', path: '/loan-accounts', permission: PERMISSIONS.LOANS_VIEW },
        { label: 'Repayments & Reversals', path: '/repayments', permission: PERMISSIONS.REPAYMENTS_VIEW },
        { label: 'Recovery Management', path: '/recoveries', permission: PERMISSIONS.REPAYMENTS_VIEW, badge: 'PAR' },
      ],
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: BarChart3,
      defaultOpen: true,
      items: [
        { label: 'Portfolio Reports', path: '/reports', permission: PERMISSIONS.REPORTS_VIEW },
      ],
    },
    {
      id: 'security',
      title: 'Security & Governance',
      icon: ShieldCheck,
      defaultOpen: false,
      items: [
        { label: 'Staff & User Access', path: '/users', permission: PERMISSIONS.USERS_MANAGE },
        { label: 'Role & Permission Matrix', path: '/roles' },
        { label: 'Active Sessions', path: '/sessions' },
        { label: 'Security Audit Logs', path: '/audit', permission: PERMISSIONS.AUDIT_LOGS_VIEW },
        { label: 'Login History', path: '/login-history' },
        { label: 'Auth Screens Gallery', path: '/auth-screens', badge: 'All 7' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-20 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Collapse Toggle */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-2">
            Navigation Modules
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
        {/* Top-Level Dashboard Link */}
        <div>
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              currentPath === '/'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Executive Dashboard"
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentPath === '/' ? 'text-white' : 'text-slate-400'}`} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </div>

        {/* Collapsible Accordion Module Groups */}
        {moduleGroups.map((group) => {
          const isOpen = openGroups[group.id] ?? false;
          const hasActiveChild = group.items.some((item) => currentPath === item.path);

          if (isCollapsed) {
            // Collapsed Icon-Only View
            return (
              <div key={group.id} className="relative group/tooltip">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-center p-2.5 rounded-xl transition ${
                    hasActiveChild ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={group.title}
                >
                  <group.icon className="w-4 h-4" />
                </button>
              </div>
            );
          }

          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
                  hasActiveChild ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <group.icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{group.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="pl-4 space-y-0.5 border-l border-slate-800/80 ml-4">
                  {group.items.map((subItem) => {
                    const isPermitted = !subItem.permission || hasPermission(subItem.permission);
                    const isActive = currentPath === subItem.path;

                    if (!isAuthenticated && subItem.path !== '/roles' && subItem.path !== '/auth-screens') {
                      return null;
                    }

                    if (!isPermitted) {
                      return (
                        <div
                          key={subItem.path}
                          className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-400 opacity-60 cursor-not-allowed rounded-md"
                          title={`Locked: Requires '${subItem.permission}'`}
                        >
                          <span className="truncate">{subItem.label}</span>
                          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{subItem.label}</span>
                        {subItem.badge && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-bold shrink-0">
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Status Pill */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Core System Online</span>
          </span>
          <span className="font-mono text-slate-400">v2.4</span>
        </div>
      )}
    </aside>
  );
};
