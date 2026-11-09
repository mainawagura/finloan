import { PERMISSIONS, PermissionValue } from './permissions';

export type RoleName =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'LOAN_OFFICER'
  | 'CREDIT_MANAGER'
  | 'FINANCE_OFFICER'
  | 'RECOVERY_OFFICER'
  | 'AUDITOR';

export interface RoleDefinition {
  name: RoleName;
  displayName: string;
  description: string;
  color: string;
  badgeColor: string;
  permissions: PermissionValue[];
}

export const ROLES: Record<RoleName, RoleDefinition> = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    displayName: 'Super Administrator',
    description: 'Full platform administration & governance. Subject to maker-checker and separation of duties.',
    color: 'border-purple-500 text-purple-700 bg-purple-50',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_CREATE,
      PERMISSIONS.CUSTOMERS_UPDATE,
      PERMISSIONS.CUSTOMERS_DELETE,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.LOANS_CREATE, // Maker role
      // Note: loans.approve & loans.reject explicitly omitted for separation of duties
      PERMISSIONS.LOANS_DISBURSE,
      PERMISSIONS.REPAYMENTS_VIEW,
      PERMISSIONS.REPAYMENTS_RECORD,
      PERMISSIONS.REPAYMENTS_REVERSE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.AUDIT_LOGS_VIEW,
      PERMISSIONS.SESSIONS_MANAGE,
    ],
  },
  ADMIN: {
    name: 'ADMIN',
    displayName: 'Operational Admin',
    description: 'Operational user provisioning, session controls, and platform compliance monitoring.',
    color: 'border-blue-500 text-blue-700 bg-blue-50',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_CREATE,
      PERMISSIONS.CUSTOMERS_UPDATE,
      PERMISSIONS.CUSTOMERS_DELETE,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.REPAYMENTS_VIEW,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.AUDIT_LOGS_VIEW,
      PERMISSIONS.SESSIONS_MANAGE,
    ],
  },
  LOAN_OFFICER: {
    name: 'LOAN_OFFICER',
    displayName: 'Loan Officer (Maker)',
    description: 'Customer onboarding and loan origination. Initiates applications pending credit review.',
    color: 'border-emerald-500 text-emerald-700 bg-emerald-50',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_CREATE,
      PERMISSIONS.CUSTOMERS_UPDATE,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.LOANS_CREATE,
      PERMISSIONS.REPAYMENTS_VIEW,
      PERMISSIONS.REPAYMENTS_RECORD,
      PERMISSIONS.REPORTS_VIEW,
    ],
  },
  CREDIT_MANAGER: {
    name: 'CREDIT_MANAGER',
    displayName: 'Credit Manager (Checker)',
    description: 'Underwriting and credit assessment. Authoritative approval/rejection checker for loan requests.',
    color: 'border-amber-500 text-amber-700 bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.LOANS_APPROVE,
      PERMISSIONS.LOANS_REJECT,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
    ],
  },
  FINANCE_OFFICER: {
    name: 'FINANCE_OFFICER',
    displayName: 'Finance Officer',
    description: 'Disbursements, wire transfers, payment posting, and authorized reversal execution.',
    color: 'border-teal-500 text-teal-700 bg-teal-50',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.LOANS_DISBURSE,
      PERMISSIONS.REPAYMENTS_VIEW,
      PERMISSIONS.REPAYMENTS_RECORD,
      PERMISSIONS.REPAYMENTS_REVERSE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
    ],
  },
  RECOVERY_OFFICER: {
    name: 'RECOVERY_OFFICER',
    displayName: 'Recovery Officer',
    description: 'Special collections, delinquency management, and recovery payment recording.',
    color: 'border-rose-500 text-rose-700 bg-rose-50',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.REPAYMENTS_VIEW,
      PERMISSIONS.REPAYMENTS_RECORD,
      PERMISSIONS.REPORTS_VIEW,
    ],
  },
  AUDITOR: {
    name: 'AUDITOR',
    displayName: 'Compliance Auditor',
    description: 'Read-only independent audit access to financial logs, user history, and security trails.',
    color: 'border-slate-500 text-slate-700 bg-slate-50',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.LOANS_VIEW,
      PERMISSIONS.REPAYMENTS_VIEW,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
      PERMISSIONS.AUDIT_LOGS_VIEW,
    ],
  },
};
