// src/hooks/usePermissions.ts

import { Permission, UserRole } from '@/lib/types/permissionTypes';
import {
  canAccessPlayerData,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole
} from '@/lib/helpers/permissions';

import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return {
    user,
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    hasRole: (roles: UserRole[]) => hasRole(user, roles),
    getAllPermissions: () => getUserPermissions(user),
    canAccessPlayerData: (playerId: string) => canAccessPlayerData(user, playerId),
  };
};

// Convenience hooks for common checks
export const useCanGenerateReports = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(Permission.GENERATE_REPORTS);
};

export const useCanDeleteReports = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(Permission.DELETE_REPORTS);
};

export const useCanViewAllPlayers = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(Permission.VIEW_ALL_PLAYERS);
};

export const useIsAdmin = () => {
  const { hasRole } = usePermissions();
  return hasRole([UserRole.ADMIN]);
};