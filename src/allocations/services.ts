import { service } from 'app/utils/service';
import type {
  Allocation,
  CreateAllocationRequest,
  UpdateAllocationRequest,
  AllocationDetailsResponse,
  UserRolesAndPermissionsRecord,
  UserAllocationRolesResponse,
} from 'generated/capital';

export async function getAllocation(allocationId: string) {
  return (await service.get<Readonly<Required<AllocationDetailsResponse>>>(`/allocations/${allocationId}`)).data;
}

export async function getAllocations() {
  return (await service.get<readonly Readonly<Allocation>[]>('/businesses/allocations')).data;
}

export async function saveAllocation(params: Readonly<CreateAllocationRequest>) {
  return (await service.post<Readonly<{ allocationId: string }>>('/allocations', params)).data.allocationId;
}

export async function updateAllocation(allocationId: string, params: Readonly<UpdateAllocationRequest>) {
  return (await service.patch<Readonly<Required<AllocationDetailsResponse>>>(`/allocations/${allocationId}`, params))
    .data;
}

export async function getUserPermissionsForAllocation(allocationId: string) {
  return (
    await service.get<Readonly<Required<UserRolesAndPermissionsRecord>>>(
      `/roles-and-permissions/allocation/${allocationId}`,
    )
  ).data;
}

export async function getUsersPermissionsForAllocation(allocationId: string) {
  return (
    await service.get<Readonly<Required<UserAllocationRolesResponse>>>(
      `/user-allocation-roles/allocation/${allocationId}`,
    )
  ).data.userRolesAndPermissionsList;
}

export async function createAllocationUserPermission(allocationId: string, granteeId: string) {
  return service.post<null>(`/user-allocation-roles/allocation/${allocationId}/user/${granteeId}`);
}

export async function updateAllocationUserPermission(allocationId: string, granteeId: string) {
  return service.put<null>(`/user-allocation-roles/allocation/${allocationId}/user/${granteeId}`);
}

export async function deleteAllocationUserPermission(allocationId: string, granteeId: string) {
  return service.remove(`/user-allocation-roles/allocation/${allocationId}/user/${granteeId}`);
}
