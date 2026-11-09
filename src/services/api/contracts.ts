/**
 * FinLoan Enterprise Security API Integration Contracts
 * Derived directly from FinLoan Specification Section 6.7 and Section 10.
 */

import { PermissionValue } from '../../app/security/constants/permissions';
import { RoleName } from '../../app/security/constants/roles';

// RFC 9457 Problem Details Standard
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  correlationId?: string;
}

// User Context Contract (Section 6.7)
export interface AuthenticatedUserContext {
  authenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    department?: string;
    avatarUrl?: string;
  };
  roles: RoleName[];
  permissions: PermissionValue[];
  session: {
    id: string;
    createdAtUtc: string;
    expiresAtUtc: string;
    idleExpiresAtUtc: string;
    idleTimeoutMinutes: number;
  };
}

// Session Entity DTO (Section 5.3)
export interface UserSessionDto {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  deviceName: string;
  browserName: string;
  operatingSystem: string;
  createdAtUtc: string;
  lastActivityAtUtc: string;
  absoluteExpiresAtUtc: string;
  idleExpiresAtUtc: string;
  isActive: boolean;
  isCurrentSession: boolean;
  revocationReason?: string | null;
}

// Login History Record (Section 4.7)
export interface LoginHistoryDto {
  id: string;
  userId: string;
  username: string;
  timestampUtc: string;
  success: boolean;
  failureCategory?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'MFA_FAILED' | 'ACCOUNT_INACTIVE' | null;
  ipAddress: string;
  userAgent: string;
  deviceName: string;
  browserName: string;
  operatingSystem: string;
  correlationId: string;
}

// Security Audit Event (Section 8.1 & 8.2)
export interface SecurityAuditEventDto {
  id: string;
  actorUserId: string;
  actorDisplayName: string;
  actorRole: string;
  action: string;
  category: 'AUTHENTICATION' | 'ACCOUNT' | 'PASSWORD' | 'MFA' | 'SESSIONS' | 'AUTHORIZATION' | 'LOANS' | 'REPAYMENTS';
  entityType: string;
  entityId: string;
  timestampUtc: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'CHALLENGE_REQUIRED';
  ipAddress: string;
  correlationId: string;
  metadata?: Record<string, any>;
  previousEventHash: string;
  eventHash: string;
}

// User Entity for Administration (Section 6.4)
export interface ApplicationUserDto {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: RoleName[];
  status: 'PENDING_ACTIVATION' | 'ACTIVE' | 'LOCKED' | 'DEACTIVATED' | 'SUSPENDED';
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lastLoginAtUtc?: string | null;
  createdAtUtc: string;
}

// Financial Transaction Models (Maker-Checker Section 7.1)
export interface LoanApplicationDto {
  id: string;
  loanNumber: string;
  borrowerName: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  purpose: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  makerUserId: string;
  makerName: string;
  checkerUserId?: string | null;
  checkerName?: string | null;
  createdAtUtc: string;
  reviewedAtUtc?: string | null;
  rejectionReason?: string | null;
  disbursedAtUtc?: string | null;
  rowVersion: number;
}
