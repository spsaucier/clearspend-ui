import { service } from 'app/utils/service';
import type {
  Allocation,
  CreateAllocationRequest,
  UpdateAllocationRequest,
  AllocationDetailsResponse,
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
  return (await service.patch<Readonly<AllocationDetailsResponse>>(`/allocations/${allocationId}`, params)).data;
}
