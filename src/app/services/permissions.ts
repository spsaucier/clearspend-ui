import { service } from 'app/utils/service';
import type { AllocationsAndPermissionsResponse } from 'generated/capital';

export async function getAllPermissions() {
  const data = (
    await service.get<Readonly<Required<AllocationsAndPermissionsResponse>>>(`/roles-and-permissions/allPermissions`)
  ).data;

  // TODO: Remove after CAP-1117
  return {
    ...data,
    allocations: data.allocations.map((item, _, self) => ({
      ...item,
      childrenAllocationIds: self.filter((a) => a.parentAllocationId === item.allocationId).map((a) => a.allocationId),
    })),
  };
}
