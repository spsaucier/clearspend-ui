import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';

import { AllocationPermissions, AllocationRoles, GlobalUserPermissions } from '../types';

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

function is(permissions: Permissions, permission: GlobalUserPermissions) {
  return Boolean(permissions?.globalUserPermissions?.includes(permission));
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

export function isCustomerService(permissions: Permissions): boolean {
  return is(permissions, 'CUSTOMER_SERVICE');
}

export const hasSomeManagerRole = (roles: UserRolesAndPermissionsRecord[]) => {
  return (
    roles.filter((r) => [AllocationRoles.Admin, AllocationRoles.Manager].includes(r.allocationRole as AllocationRoles))
      .length > 0
  );
};

// Filter
export const byAllowableRoles = (r: UserRolesAndPermissionsRecord) =>
  [AllocationRoles.Admin, AllocationRoles.Manager, AllocationRoles.ViewOnly].includes(
    r.allocationRole as AllocationRoles,
  );

export const allocationsWhereCanManageFunds = (
  allocations: Readonly<Allocation[]>,
  currentUserRoles: Readonly<UserRolesAndPermissionsRecord[]>,
) =>
  allocations.filter((item) => {
    if (item.archived) return false;
    const permissions = currentUserRoles.find(allocationWithID(item.allocationId));
    return permissions && canManageFunds(permissions);
  });
