/**
 * FinLoan Authentication & Persona Provider
 * Handles user identity state, persona switching, and permission checks.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleName } from '../security/constants/roles';
import { PermissionValue } from '../security/constants/permissions';
import { AuthenticatedUserContext } from '../../services/api/contracts';
import { DEMO_PERSONAS } from '../../services/api/mockData';

interface AuthContextType {
  userContext: AuthenticatedUserContext | null;
  currentRole: RoleName | null;
  isAuthenticated: boolean;
  switchPersona: (role: RoleName | null) => void;
  login: (role?: RoleName) => void;
  logout: () => void;
  hasPermission: (permission: PermissionValue | PermissionValue[]) => boolean;
  hasRole: (role: RoleName | RoleName[]) => boolean;
  sessionRemainingSeconds: number;
  idleRemainingSeconds: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to unauthenticated (null) on first load so users must sign in via LoginPage
  const [currentRole, setCurrentRole] = useState<RoleName | null>(null);
  const [userContext, setUserContext] = useState<AuthenticatedUserContext | null>(null);
  
  // Simulated idle timer (15 mins = 900 seconds) & absolute session timer (8 hours = 28800s)
  const [idleRemainingSeconds, setIdleRemainingSeconds] = useState<number>(890);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(27500);

  useEffect(() => {
    if (currentRole) {
      setUserContext(DEMO_PERSONAS[currentRole] || null);
    } else {
      setUserContext(null);
    }
  }, [currentRole]);

  // Tick the countdown timer to demonstrate session activity monitoring
  useEffect(() => {
    if (!currentRole) return;
    const interval = setInterval(() => {
      setIdleRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setSessionRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentRole]);

  const switchPersona = (role: RoleName | null) => {
    setCurrentRole(role);
    setIdleRemainingSeconds(900); // reset idle on switch
  };

  const login = (role: RoleName = 'SUPER_ADMIN') => {
    setCurrentRole(role);
    setIdleRemainingSeconds(900);
  };

  const logout = () => {
    setCurrentRole(null);
    setUserContext(null);
  };

  const hasPermission = (permission: PermissionValue | PermissionValue[]): boolean => {
    if (!userContext || !userContext.authenticated) return false;
    const required = Array.isArray(permission) ? permission : [permission];
    return required.every((p) => userContext.permissions.includes(p));
  };

  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!userContext || !userContext.authenticated) return false;
    const targetRoles = Array.isArray(role) ? role : [role];
    return targetRoles.some((r) => userContext.roles.includes(r));
  };

  return (
    <AuthContext.Provider
      value={{
        userContext,
        currentRole,
        isAuthenticated: !!userContext && userContext.authenticated,
        switchPersona,
        login,
        logout,
        hasPermission,
        hasRole,
        sessionRemainingSeconds,
        idleRemainingSeconds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
