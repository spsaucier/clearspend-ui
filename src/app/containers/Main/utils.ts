import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import type { BusinessStatus } from 'app/types/businesses';
import type { Business, AllocationsAndPermissionsResponse } from 'generated/capital';

export function isStatus(business: Readonly<Business> | null, status: BusinessStatus): boolean {
  return business?.status === status;
}

export async function getPermissions(fetcher: () => Promise<Readonly<Required<AllocationsAndPermissionsResponse>>>) {
  const perm = await fetcher();

  return {
    permissions: getRootAllocation(perm.userRoles),
    allocations: perm.allocations,
    roles: perm.userRoles,
  };
}
