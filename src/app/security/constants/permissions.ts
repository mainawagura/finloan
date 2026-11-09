/**
 * FinLoan Security Permissions Catalogue (Specification Section 6.3)
 * Central authority for all discrete application capabilities.
 */
export const PERMISSIONS = {
  // Customer Permissions
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_CREATE: 'customers.create',
  CUSTOMERS_UPDATE: 'customers.update',
  CUSTOMERS_DELETE: 'customers.delete',

  // Loan Processing Permissions
  LOANS_VIEW: 'loans.view',
  LOANS_CREATE: 'loans.create', // Maker capability
  LOANS_APPROVE: 'loans.approve', // Checker capability
  LOANS_REJECT: 'loans.reject',   // Checker capability
  LOANS_DISBURSE: 'loans.disburse',

  // Repayment Permissions
  REPAYMENTS_VIEW: 'repayments.view',
  REPAYMENTS_RECORD: 'repayments.record',
  REPAYMENTS_REVERSE: 'repayments.reverse',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // Administrative & Security
  USERS_MANAGE: 'users.manage',
  AUDIT_LOGS_VIEW: 'audit-logs.view',
  SESSIONS_MANAGE: 'sessions.manage',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];

export interface PermissionDefinition {
  id: PermissionValue;
  name: string;
  category: 'Customers' | 'Loans' | 'Repayments' | 'Reports' | 'Administration';
  description: string;
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  { id: PERMISSIONS.CUSTOMERS_VIEW, name: 'View Customers', category: 'Customers', description: 'View customer directories, profiles, and basic KYC data.' },
  { id: PERMISSIONS.CUSTOMERS_CREATE, name: 'Create Customers', category: 'Customers', description: 'Onboard new borrowers and register customer entities.' },
  { id: PERMISSIONS.CUSTOMERS_UPDATE, name: 'Update Customers', category: 'Customers', description: 'Modify customer contact details and profile status.' },
  { id: PERMISSIONS.CUSTOMERS_DELETE, name: 'Delete Customers', category: 'Customers', description: 'Soft-delete or purge unqualified lead records.' },

  { id: PERMISSIONS.LOANS_VIEW, name: 'View Loans', category: 'Loans', description: 'Access loan portfolios, schedule calculators, and application statuses.' },
  { id: PERMISSIONS.LOANS_CREATE, name: 'Create Loans (Maker)', category: 'Loans', description: 'Initiate new loan applications for borrower accounts.' },
  { id: PERMISSIONS.LOANS_APPROVE, name: 'Approve Loans (Checker)', category: 'Loans', description: 'Review and approve loan applications submitted by makers.' },
  { id: PERMISSIONS.LOANS_REJECT, name: 'Reject Loans (Checker)', category: 'Loans', description: 'Decline loan applications with formal rejection notes.' },
  { id: PERMISSIONS.LOANS_DISBURSE, name: 'Disburse Loans', category: 'Loans', description: 'Authorize payout and release principal funds to customer.' },

  { id: PERMISSIONS.REPAYMENTS_VIEW, name: 'View Repayments', category: 'Repayments', description: 'View borrower ledger, payment history, and delinquency reports.' },
  { id: PERMISSIONS.REPAYMENTS_RECORD, name: 'Record Repayments', category: 'Repayments', description: 'Post manual or inbound wire loan repayments.' },
  { id: PERMISSIONS.REPAYMENTS_REVERSE, name: 'Reverse Repayments', category: 'Repayments', description: 'Initiate and authorize correction reversals for erroneous transactions.' },

  { id: PERMISSIONS.REPORTS_VIEW, name: 'View Reports', category: 'Reports', description: 'Access operational dashboards and financial health reports.' },
  { id: PERMISSIONS.REPORTS_EXPORT, name: 'Export Reports', category: 'Reports', description: 'Export sensitive loan books and financial summaries to CSV/Excel.' },

  { id: PERMISSIONS.USERS_MANAGE, name: 'Manage Users & Roles', category: 'Administration', description: 'Create internal staff accounts and assign security roles.' },
  { id: PERMISSIONS.AUDIT_LOGS_VIEW, name: 'View Audit Logs', category: 'Administration', description: 'Inspect immutable security and financial audit event logs.' },
  { id: PERMISSIONS.SESSIONS_MANAGE, name: 'Manage Sessions', category: 'Administration', description: 'Inspect active concurrent sessions and revoke anomalous tokens.' },
];
