import React from 'react';
import { usePathname } from './router';
import { ProtectedRoute } from '../security/ProtectedRoute';
import { PERMISSIONS } from '../security/constants/permissions';
import { useAuth } from '../providers/AuthProvider';

// Landing & Public Pages
import { LandingPage } from '../../features/landing/pages/LandingPage';

// Feature Pages - Lending Lifecycle
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { CustomerManagementPage } from '../../features/customers/pages/CustomerManagementPage';
import { LoanProductsPage } from '../../features/loan-products/pages/LoanProductsPage';
import { LoanApplicationsPage } from '../../features/loan-applications/pages/LoanApplicationsPage';
import { CreditAssessmentPage } from '../../features/credit-assessment/pages/CreditAssessmentPage';
import { LoanApprovalsPage } from '../../features/loan-approvals/pages/LoanApprovalsPage';
import { DisbursementPage } from '../../features/disbursements/pages/DisbursementPage';
import { LoanAccountsPage } from '../../features/loan-accounts/pages/LoanAccountsPage';
import { RepaymentsPage } from '../../features/financial-demo/pages/RepaymentsPage';
import { LoanRecoveryPage } from '../../features/recoveries/pages/LoanRecoveryPage';
import { ReportsPage } from '../../features/reports/pages/ReportsPage';

// Feature Pages - Security & Authentication
import { LoginPage } from '../../features/authentication/pages/LoginPage';
import { ForgotPasswordPage } from '../../features/authentication/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/authentication/pages/ResetPasswordPage';
import { EmailVerificationPage } from '../../features/authentication/pages/EmailVerificationPage';
import { MfaVerificationPage } from '../../features/authentication/pages/MfaVerificationPage';
import { UnauthorizedPage } from '../../features/authentication/pages/UnauthorizedPage';
import { SessionExpiredPage } from '../../features/authentication/pages/SessionExpiredPage';
import { AuthScreensGalleryPage } from '../../features/authentication/pages/AuthScreensGalleryPage';
import { ActiveSessionsPage } from '../../features/sessions/pages/ActiveSessionsPage';
import { LoginHistoryPage } from '../../features/security-monitoring/pages/LoginHistoryPage';
import { SecurityAuditPage } from '../../features/security-monitoring/pages/SecurityAuditPage';
import { UserManagementPage } from '../../features/access-control/pages/UserManagementPage';
import { RoleMatrixPage } from '../../features/access-control/pages/RoleMatrixPage';

export const AppRoutes: React.FC = () => {
  const path = usePathname();
  const { isAuthenticated } = useAuth();

  switch (path) {
    // PUBLIC LANDING & AUTH
    case '/landing':
      return <LandingPage />;

    case '/':
      return isAuthenticated ? <DashboardPage /> : <LoginPage />;

    case '/dashboard':
      return <DashboardPage />;

    case '/login':
      return <LoginPage />;

    case '/forgot-password':
      return <ForgotPasswordPage />;

    case '/reset-password':
      return <ResetPasswordPage />;

    case '/email-verification':
      return <EmailVerificationPage />;

    case '/mfa-verification':
      return <MfaVerificationPage />;

    case '/unauthorized':
      return <UnauthorizedPage />;

    case '/session-expired':
      return <SessionExpiredPage />;

    case '/auth-screens':
      return <AuthScreensGalleryPage />;

    // LENDING LIFECYCLE ROUTES
    case '/customers':
      return (
        <ProtectedRoute permission={PERMISSIONS.CUSTOMERS_VIEW}>
          <CustomerManagementPage />
        </ProtectedRoute>
      );

    case '/loan-products':
      return <LoanProductsPage />;

    case '/loan-applications':
      return (
        <ProtectedRoute permission={PERMISSIONS.LOANS_VIEW}>
          <LoanApplicationsPage />
        </ProtectedRoute>
      );

    case '/credit-assessment':
      return (
        <ProtectedRoute permission={PERMISSIONS.LOANS_VIEW}>
          <CreditAssessmentPage />
        </ProtectedRoute>
      );

    case '/loan-approvals':
      return (
        <ProtectedRoute permission={PERMISSIONS.LOANS_VIEW}>
          <LoanApprovalsPage />
        </ProtectedRoute>
      );

    case '/disbursements':
      return (
        <ProtectedRoute permission={PERMISSIONS.LOANS_VIEW}>
          <DisbursementPage />
        </ProtectedRoute>
      );

    case '/loan-accounts':
      return (
        <ProtectedRoute permission={PERMISSIONS.LOANS_VIEW}>
          <LoanAccountsPage />
        </ProtectedRoute>
      );

    case '/repayments':
      return (
        <ProtectedRoute permission={PERMISSIONS.REPAYMENTS_VIEW}>
          <RepaymentsPage />
        </ProtectedRoute>
      );

    case '/recoveries':
      return (
        <ProtectedRoute permission={PERMISSIONS.REPAYMENTS_VIEW}>
          <LoanRecoveryPage />
        </ProtectedRoute>
      );

    case '/reports':
      return (
        <ProtectedRoute permission={PERMISSIONS.REPORTS_VIEW}>
          <ReportsPage />
        </ProtectedRoute>
      );

    // SECURITY & AUDIT ROUTES
    case '/sessions':
      return (
        <ProtectedRoute>
          <ActiveSessionsPage />
        </ProtectedRoute>
      );

    case '/login-history':
      return (
        <ProtectedRoute>
          <LoginHistoryPage />
        </ProtectedRoute>
      );

    case '/audit':
      return (
        <ProtectedRoute permission={PERMISSIONS.AUDIT_LOGS_VIEW}>
          <SecurityAuditPage />
        </ProtectedRoute>
      );

    case '/users':
      return (
        <ProtectedRoute permission={PERMISSIONS.USERS_MANAGE}>
          <UserManagementPage />
        </ProtectedRoute>
      );

    case '/roles':
      return <RoleMatrixPage />;

    default:
      return isAuthenticated ? <DashboardPage /> : <LandingPage />;
  }
};
