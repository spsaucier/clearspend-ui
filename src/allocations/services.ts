import { service } from 'app/utils/service';
import type { Allocation, CreateAllocationRequest } from 'generated/capital';

export async function getAllocation(allocationId: string) {
  return (await service.get<Readonly<Allocation>>(`/allocations/${allocationId}`)).data;
}

export async function getAllocations() {
  return (await service.get<readonly Readonly<Allocation>[]>('/businesses/allocations')).data;
}

export async function saveAllocation(params: Readonly<CreateAllocationRequest>) {
  return (await service.post<Readonly<{ allocationId: string }>>('/allocations', params)).data.allocationId;
}
