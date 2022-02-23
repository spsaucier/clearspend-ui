import { service } from 'app/utils/service';
import type { UserRolesAndPermissionsRecord } from 'generated/capital';

export async function getPermissions() {
  try {
    return (await service.get<Readonly<UserRolesAndPermissionsRecord> | null>('/roles-and-permissions/')).data;
  } catch {
    return {} as UserRolesAndPermissionsRecord;
  }
}

export async function getAllocationPermissions(allocationId: string) {
  return (
    await service.get<Readonly<UserRolesAndPermissionsRecord>>(`/roles-and-permissions/allocation/${allocationId}`)
  ).data;
}
