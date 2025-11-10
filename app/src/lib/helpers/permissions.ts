import { Permission, ROLE_PERMISSIONS, UserRole } from '@/lib/types/permissionTypes';

import { TUser } from '@/lib/types/authTypes';

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: TUser | null, permission: Permission): boolean => {
  if (!user || !user.roles || user.roles.length === 0) return false;
  
  return user.roles.some(role => {
    const rolePermissions = ROLE_PERMISSIONS[role as UserRole];
    return rolePermissions?.includes(permission) || false;
  });
};

/**
 * Check if user has ANY of the specified permissions
 */
export const hasAnyPermission = (user: TUser | null, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has ALL of the specified permissions
 */
export const hasAllPermissions = (user: TUser | null, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (user: TUser | null, roles: UserRole[]): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some(role => roles.includes(role as UserRole));
};

/**
 * Get all permissions for current user
 */
export const getUserPermissions = (user: TUser | null): Permission[] => {
  if (!user || !user.roles) return [];
  
  const permissions = new Set<Permission>();
  
  user.roles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role as UserRole] || [];
    rolePermissions.forEach(permission => permissions.add(permission));
  });
  
  return Array.from(permissions);
};

/**
 * Check if user can access a specific player's data
 */
export const canAccessPlayerData = (user: TUser | null, playerId: string): boolean => {
  if (!user) return false;
  
  // Admins and coaches can access all players
  if (hasPermission(user, Permission.VIEW_ALL_PLAYERS)) return true;
  
  // Players can only access their own data
  if (hasPermission(user, Permission.VIEW_OWN_DATA)) {
    // Assuming coachId actually stores playerId for players
    // Adjust this logic based on your actual data structure
    return user.coachId === playerId;
  }
  
  return false;
};