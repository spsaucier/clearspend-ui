import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';

import type { AccessibleAllocation } from '../types';

import { byAllowableRoles } from './permissions';

export function getAccessibleAllocations(
  allocations: readonly Readonly<Allocation>[] | null,
  roles: Readonly<UserRolesAndPermissionsRecord>[],
): readonly Readonly<AccessibleAllocation>[] {
  const ids = roles.filter(byAllowableRoles).map((r) => r.allocationId);
  return (allocations || []).map((a) => (ids.includes(a.allocationId) ? a : { ...a, inaccessible: true }));
}
