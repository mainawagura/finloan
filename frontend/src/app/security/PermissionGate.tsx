import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { PermissionValue } from './constants/permissions';

interface PermissionGateProps {
  permission: PermissionValue | PermissionValue[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * PermissionGate (Section 9.5)
 * Conditionally renders UI elements based on user permissions.
 * NOTE: As per Section 1.1, this is a UX enhancement only; actual authorization is enforced by the backend API.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  fallback = null,
  children,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
