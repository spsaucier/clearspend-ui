import { service } from 'app/utils/service';
import type {
  Allocation,
  CreateAllocationRequest,
  UpdateAllocationRequest,
  AllocationDetailsResponse,
  UserAllocationRolesResponse,
  ArchiveAllocationResponse,
  AllocationAutoTopUpConfigResponse,
  AllocationAutoTopUpConfigCreateRequest,
  AllocationAutoTopUpConfigUpdateRequest,
} from 'generated/capital';

import type { AllocationRoles } from './types';

export async function getAllocation(allocationId: string) {
  return (await service.get<Readonly<Required<AllocationDetailsResponse>>>(`/allocations/${allocationId}`)).data;
}

export async function getAllocations() {
  return (await service.get<readonly Readonly<Allocation>[]>('/businesses/allocations')).data;
}

export async function completeOnboarding() {
  return (await service.post<readonly Readonly<Allocation>[]>('/businesses/complete-onboarding')).data;
}

export async function saveAllocation(params: Readonly<CreateAllocationRequest>) {
  return (await service.post<Readonly<{ allocationId: string }>>('/allocations', params)).data.allocationId;
}

export async function updateAllocation(allocationId: string, params: Readonly<UpdateAllocationRequest>) {
  return (await service.patch<Readonly<Required<AllocationDetailsResponse>>>(`/allocations/${allocationId}`, params))
    .data;
}

export async function archiveAllocation(allocationId: string) {
  return (await service.patch<Readonly<Required<ArchiveAllocationResponse>>>(`/allocations/${allocationId}/archive`))
    .data;
}

export async function getAllocationRoles(allocationId: string) {
  try {
    return (await service.get<UserAllocationRolesResponse>(`/user-allocation-roles/allocation/${allocationId}`)).data
      .userRolesAndPermissionsList;
  } catch {
    return [];
  }
}

export async function createOrUpdateAllocationRole(allocationId: string, userId: string, role: AllocationRoles) {
  await service.put(`/user-allocation-roles/allocation/${allocationId}/user/${userId}`, role);
}

export async function removeAllocationRole(allocationId: string, userId: string) {
  await service.remove(`/user-allocation-roles/allocation/${allocationId}/user/${userId}`);
}

export async function getAllocationAutoTopUpConfig(allocationId: string) {
  try {
    const autoTopUpConfigs = (
      await service.get<AllocationAutoTopUpConfigResponse[]>(`/allocation/${allocationId}/auto-top-up`)
    ).data;
    // Currently only support one, but backend allows for multiple for future
    return autoTopUpConfigs.length > 0 ? autoTopUpConfigs[0] : undefined;
  } catch {
    return undefined;
  }
}

export async function createAllocationAutoTopUpConfig(
  allocationId: string,
  autoTopUpConfig: AllocationAutoTopUpConfigCreateRequest,
) {
  try {
    return await service.post(`/allocation/${allocationId}/auto-top-up`, autoTopUpConfig);
  } catch {
    return undefined;
  }
}

export async function removeAllocationAutoTopUpConfig(autoTopUpId: string) {
  try {
    return await service.remove(`/allocation/auto-top-up/${autoTopUpId}`);
  } catch {
    return undefined;
  }
}

export async function updateAllocationAutoTopUpConfig(
  allocationId: string,
  autoTopUpConfig: AllocationAutoTopUpConfigUpdateRequest,
) {
  try {
    return await service.patch(`/allocation/${allocationId}/auto-top-up`, autoTopUpConfig);
  } catch {
    return undefined;
  }
}
