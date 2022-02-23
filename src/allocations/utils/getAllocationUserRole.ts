import type { UserRolesAndPermissionsRecord } from 'generated/capital';

import { AllocationRoles } from '../types';
import type { AllocationUserRole } from '../types';

export function getAllocationUserRole(
  data: Readonly<UserRolesAndPermissionsRecord>,
  inherited?: boolean,
): Readonly<AllocationUserRole> {
  return {
    user: data.user!,
    inherited: inherited ?? Boolean(data.inherited),
    role:
      data.allocationRole === AllocationRoles.Admin
        ? AllocationRoles.Manager
        : (data.allocationRole as AllocationRoles),
  };
}
