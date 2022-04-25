import { service } from 'app/utils/service';
import type { AllocationsAndPermissionsResponse } from 'generated/capital';

export async function getAllPermissions() {
  return (
    await service.get<Readonly<Required<AllocationsAndPermissionsResponse>>>(`/roles-and-permissions/allPermissions`)
  ).data;
}
