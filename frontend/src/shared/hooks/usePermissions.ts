import { useAuth } from './useAuth';
import { PermissionValue } from '../../app/security/constants/permissions';

export const usePermissions = () => {
  const { userContext, hasPermission } = useAuth();
  return {
    permissions: userContext?.permissions || [],
    hasPermission,
  };
};

export const useHasPermission = (permission: PermissionValue | PermissionValue[]) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};
