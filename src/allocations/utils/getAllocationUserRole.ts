import type { UserRolesAndPermissionsRecord } from 'generated/capital';

import type { AllocationRoles, AllocationUserRole } from '../types';

export function getAllocationUserRole(
  data: Readonly<UserRolesAndPermissionsRecord>,
  inherited?: boolean,
): Readonly<AllocationUserRole> {
  return {
    user: data.user!,
    inherited: inherited ?? Boolean(data.inherited),
    role: data.allocationRole as AllocationRoles,
  };
}
