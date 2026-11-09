import React from 'react';
import { Router, usePathname } from './app/router/router';
import { AuthProvider, useAuth } from './app/providers/AuthProvider';
import { AppLayout } from './shared/components/layout/AppLayout';
import { AppRoutes } from './app/router/routes';

const AppContent: React.FC = () => {
  const path = usePathname();
  const { isAuthenticated } = useAuth();

  // Public standalone pages that should NOT have the internal app sidebar/header
  const isStandalonePublicRoute =
    path === '/landing' ||
    path === '/login' ||
    path === '/forgot-password' ||
    path === '/reset-password' ||
    path === '/email-verification' ||
    path === '/mfa-verification' ||
    (path === '/' && !isAuthenticated);

  if (isStandalonePublicRoute) {
    return <AppRoutes />;
  }

  // Authenticated internal workspace with fixed collapsible sidebar & header
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
