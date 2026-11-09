/**
 * FinLoan Auth & Security Service (Phase 1 Frontend Mock Implementation)
 * Adheres to Section 9.6: Simulates backend responses without fake crypto or secret storage.
 */

import { DEMO_PERSONAS, INITIAL_MOCK_SESSIONS, INITIAL_LOGIN_HISTORY, INITIAL_AUDIT_LOGS, INITIAL_USERS, INITIAL_LOANS } from './mockData';
import { AuthenticatedUserContext, UserSessionDto, LoginHistoryDto, SecurityAuditEventDto, ApplicationUserDto, LoanApplicationDto } from './contracts';
import { RoleName, ROLES } from '../../app/security/constants/roles';
import { PERMISSION_DEFINITIONS } from '../../app/security/constants/permissions';

class AuthService {
  private sessionsState: UserSessionDto[] = [...INITIAL_MOCK_SESSIONS];
  private auditState: SecurityAuditEventDto[] = [...INITIAL_AUDIT_LOGS];
  private usersState: ApplicationUserDto[] = [...INITIAL_USERS];
  private loansState: LoanApplicationDto[] = [...INITIAL_LOANS];
  private loginHistoryState: LoginHistoryDto[] = [...INITIAL_LOGIN_HISTORY];

  // Current session simulation
  public async getMe(role: RoleName | null): Promise<AuthenticatedUserContext | null> {
    if (!role) return null;
    return DEMO_PERSONAS[role] || null;
  }

  public async getSessions(): Promise<UserSessionDto[]> {
    return [...this.sessionsState];
  }

  public async getCurrentSession(): Promise<UserSessionDto | undefined> {
    return this.sessionsState.find((s) => s.isCurrentSession);
  }

  public async revokeSession(id: string): Promise<void> {
    this.sessionsState = this.sessionsState.map((s) =>
      s.id === id ? { ...s, isActive: false, revocationReason: 'Revoked by user via Active Sessions console' } : s
    );
    this.recordAuditEvent({
      action: 'SESSION_REVOKED',
      category: 'SESSIONS',
      entityType: 'UserSession',
      entityId: id,
      outcome: 'SUCCESS',
      metadata: { initiatedBy: 'Current User' },
    });
  }

  public async revokeAllOtherSessions(): Promise<void> {
    this.sessionsState = this.sessionsState.map((s) =>
      s.isCurrentSession ? s : { ...s, isActive: false, revocationReason: 'Bulk revocation triggered' }
    );
    this.recordAuditEvent({
      action: 'ALL_SESSIONS_REVOKED',
      category: 'SESSIONS',
      entityType: 'UserSession',
      entityId: 'ALL_EXCEPT_CURRENT',
      outcome: 'SUCCESS',
      metadata: { count: this.sessionsState.length - 1 },
    });
  }

  public async getLoginHistory(): Promise<LoginHistoryDto[]> {
    return [...this.loginHistoryState];
  }

  public async getAuditLogs(): Promise<SecurityAuditEventDto[]> {
    return [...this.auditState];
  }

  public async getUsers(): Promise<ApplicationUserDto[]> {
    return [...this.usersState];
  }

  public async updateUserRoles(userId: string, newRoles: RoleName[], actorRole: string): Promise<ApplicationUserDto> {
    const user = this.usersState.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.roles = newRoles;

    this.recordAuditEvent({
      action: 'ROLE_MODIFIED',
      category: 'AUTHORIZATION',
      entityType: 'ApplicationUser',
      entityId: userId,
      outcome: 'SUCCESS',
      metadata: { targetUser: user.username, assignedRoles: newRoles, actorRole },
    });

    return { ...user };
  }

  public async getRoles() {
    return Object.values(ROLES);
  }

  public async getPermissions() {
    return PERMISSION_DEFINITIONS;
  }

  public async getLoans(): Promise<LoanApplicationDto[]> {
    return [...this.loansState];
  }

  public async approveLoan(loanId: string, checkerUserId: string, checkerName: string): Promise<LoanApplicationDto> {
    const loan = this.loansState.find((l) => l.id === loanId);
    if (!loan) throw new Error('Loan not found');

    // Section 7.2 Separation of duties enforcement:
    if (loan.makerUserId === checkerUserId) {
      throw new Error('Maker-Checker Violation: Transaction maker cannot self-approve loan application.');
    }

    loan.status = 'APPROVED';
    loan.checkerUserId = checkerUserId;
    loan.checkerName = checkerName;
    loan.reviewedAtUtc = new Date().toISOString();
    loan.rowVersion += 1;

    this.recordAuditEvent({
      action: 'LOAN_APPROVED',
      category: 'LOANS',
      entityType: 'LoanApplication',
      entityId: loanId,
      outcome: 'SUCCESS',
      metadata: { amount: loan.amount, checkerName },
    });

    return { ...loan };
  }

  public async rejectLoan(loanId: string, checkerUserId: string, checkerName: string, reason: string): Promise<LoanApplicationDto> {
    const loan = this.loansState.find((l) => l.id === loanId);
    if (!loan) throw new Error('Loan not found');

    if (loan.makerUserId === checkerUserId) {
      throw new Error('Maker-Checker Violation: Transaction maker cannot review their own transaction.');
    }

    loan.status = 'REJECTED';
    loan.checkerUserId = checkerUserId;
    loan.checkerName = checkerName;
    loan.rejectionReason = reason;
    loan.reviewedAtUtc = new Date().toISOString();
    loan.rowVersion += 1;

    this.recordAuditEvent({
      action: 'LOAN_REJECTED',
      category: 'LOANS',
      entityType: 'LoanApplication',
      entityId: loanId,
      outcome: 'SUCCESS',
      metadata: { reason, checkerName },
    });

    return { ...loan };
  }

  public async disburseLoan(loanId: string, actorName: string): Promise<LoanApplicationDto> {
    const loan = this.loansState.find((l) => l.id === loanId);
    if (!loan) throw new Error('Loan not found');
    if (loan.status !== 'APPROVED') {
      throw new Error('Cannot disburse unapproved loan.');
    }

    loan.status = 'DISBURSED';
    loan.disbursedAtUtc = new Date().toISOString();
    loan.rowVersion += 1;

    this.recordAuditEvent({
      action: 'LOAN_DISBURSED',
      category: 'LOANS',
      entityType: 'LoanApplication',
      entityId: loanId,
      outcome: 'SUCCESS',
      metadata: { amount: loan.amount, disbursedBy: actorName },
    });

    return { ...loan };
  }

  private recordAuditEvent(params: {
    action: string;
    category: SecurityAuditEventDto['category'];
    entityType: string;
    entityId: string;
    outcome: 'SUCCESS' | 'FAILURE' | 'CHALLENGE_REQUIRED';
    metadata?: Record<string, any>;
  }) {
    const lastEvent = this.auditState[this.auditState.length - 1];
    const prevHash = lastEvent ? lastEvent.eventHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const fakeHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newEvent: SecurityAuditEventDto = {
      id: `aud-${Date.now()}`,
      actorUserId: 'usr-current',
      actorDisplayName: 'Current Persona',
      actorRole: 'ACTIVE_ROLE',
      action: params.action,
      category: params.category,
      entityType: params.entityType,
      entityId: params.entityId,
      timestampUtc: new Date().toISOString(),
      outcome: params.outcome,
      ipAddress: '192.168.10.45',
      correlationId: `req-${Math.random().toString(36).substring(2, 9)}`,
      metadata: params.metadata,
      previousEventHash: prevHash,
      eventHash: fakeHash,
    };

    this.auditState = [newEvent, ...this.auditState];
  }
}

export const authService = new AuthService();
