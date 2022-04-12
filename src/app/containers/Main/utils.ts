import { BusinessStatus } from 'app/types/businesses';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import type { Business, AllocationsAndPermissionsResponse } from 'generated/capital';

export function isStatus(business: Readonly<Business> | null, status: BusinessStatus): boolean {
  return business?.status === status;
}

export async function getPermissions(
  business: Readonly<Business> | null,
  fetcher: (businessId: string) => Promise<Readonly<Required<AllocationsAndPermissionsResponse>>>,
) {
  // TODO: CAP-440
  const perm = isStatus(business, BusinessStatus.ACTIVE) ? await fetcher(business!.businessId!) : undefined;

  return {
    permissions: perm && getRootAllocation(perm.userRoles),
    allocations: perm?.allocations,
    roles: perm?.userRoles,
  };
}
