import type { UserRolesAndPermissionsRecord } from 'generated/capital';

import { AllocationPermissions, AllocationRoles } from '../types';

import { allocationWithID } from './allocationWithID';

type Permissions = Readonly<UserRolesAndPermissionsRecord> | null;

export function getAllocationPermissions(
  roles: Readonly<UserRolesAndPermissionsRecord>[],
  id: string | undefined,
): Readonly<UserRolesAndPermissionsRecord> | null {
  return roles.find(allocationWithID(id)) || null;
}

function can(permissions: Permissions, permission: AllocationPermissions) {
  return Boolean(permissions?.allocationPermissions?.includes(permission));
}

export function canLinkBankAccounts(permissions: Permissions): boolean {
  return can(permissions, 'LINK_BANK_ACCOUNTS');
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

export function canLinkReceipts(permissions: Permissions): boolean {
  return can(permissions, 'LINK_RECEIPTS');
}

// Filter
export const byAllowableRoles = (r: UserRolesAndPermissionsRecord) =>
  [AllocationRoles.Admin, AllocationRoles.Manager, AllocationRoles.ViewOnly].includes(
    r.allocationRole as AllocationRoles,
  );
