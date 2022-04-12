import { service } from 'app/utils/service';
import type { AllocationsAndPermissionsResponse } from 'generated/capital';

export async function getAllPermissions(businessId: string) {
  return (
    await service.get<Readonly<Required<AllocationsAndPermissionsResponse>>>(
      `/roles-and-permissions/allPermissions/${businessId}`,
    )
  ).data;
}
