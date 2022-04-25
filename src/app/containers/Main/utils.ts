import { BusinessStatus } from 'app/types/businesses';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import type { Business, AllocationsAndPermissionsResponse } from 'generated/capital';

export function isStatus(business: Readonly<Business> | null, status: BusinessStatus): boolean {
  return business?.status === status;
}

export async function getPermissions(
  business: Readonly<Business> | null,
  fetcher: () => Promise<Readonly<Required<AllocationsAndPermissionsResponse>>>,
) {
  const perm = isStatus(business, BusinessStatus.ACTIVE) ? await fetcher() : undefined;

  return {
    permissions: perm && getRootAllocation(perm.userRoles),
    allocations: perm?.allocations,
    roles: perm?.userRoles,
  };
}
