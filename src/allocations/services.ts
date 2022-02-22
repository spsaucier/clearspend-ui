import { service } from 'app/utils/service';
import type {
  Allocation,
  CreateAllocationRequest,
  UpdateAllocationRequest,
  AllocationDetailsResponse,
  UserAllocationRolesResponse,
} from 'generated/capital';

import type { AllocationRoles } from './types';

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

export async function getAllocationRoles(allocationId: string) {
  return (await service.get<UserAllocationRolesResponse>(`/user-allocation-roles/allocation/${allocationId}`)).data
    .userRolesAndPermissionsList;
}

export async function addAllocationRole(allocationId: string, userId: string, role: AllocationRoles) {
  await service.post(`/user-allocation-roles/allocation/${allocationId}/user/${userId}`, role);
}
