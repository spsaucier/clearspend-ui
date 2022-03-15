import type { UserRolesAndPermissionsRecord } from 'generated/capital';

import type { AllocationPermissions } from '../types';

type Permissions = Readonly<UserRolesAndPermissionsRecord> | null;

function can(permissions: Permissions, permission: AllocationPermissions) {
  return Boolean(permissions?.allocationPermissions?.includes(permission));
}

export function canManageFunds(permissions: Permissions): boolean {
  return can(permissions, 'MANAGE_FUNDS');
}

export function canManageCards(permissions: Permissions): boolean {
  return can(permissions, 'MANAGE_CARDS');
}

export function canManageUsers(permissions: Permissions): boolean {
  return can(permissions, 'MANAGE_USERS');
}

export function canManagePermissions(permissions: Permissions): boolean {
  return can(permissions, 'MANAGE_PERMISSIONS');
}

export function canManageConnections(permissions: Permissions): boolean {
  return can(permissions, 'MANAGE_CONNECTIONS');
}

export function canRead(permissions: Permissions): boolean {
  return can(permissions, 'READ');
}
