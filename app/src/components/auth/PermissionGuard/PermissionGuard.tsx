// src/components/auth/PermissionGuard.tsx

import { Permission, UserRole } from '@/lib/types/permissionTypes';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  fallback = null, 
  children 
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Multiple permissions (ANY)
interface AnyPermissionGuardProps {
  permissions: Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AnyPermissionGuard: React.FC<AnyPermissionGuardProps> = ({
  permissions,
  fallback = null,
  children
}) => {
  const { hasAnyPermission } = usePermissions();
  
  if (!hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Multiple permissions (ALL)
export const AllPermissionsGuard: React.FC<AnyPermissionGuardProps> = ({
  permissions,
  fallback = null,
  children
}) => {
  const { hasAllPermissions } = usePermissions();
  
  if (!hasAllPermissions(permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Role-based guard
interface RoleGuardProps {
  roles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  fallback = null,
  children
}) => {
  const { hasRole } = usePermissions();
  
  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};