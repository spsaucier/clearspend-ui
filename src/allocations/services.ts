import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';

import type { Allocation, CreateAllocation } from './types';

export async function getAllocation(allocationId: UUIDString) {
  return (await service.get<Readonly<Allocation>>(`/allocations/${allocationId}`)).data;
}

export async function getAllocations() {
  return (await service.get<readonly Readonly<Allocation>[]>('/businesses/allocations')).data;
}

export async function saveAllocation(params: Readonly<CreateAllocation>) {
  return (await service.post<Readonly<{ allocationId: UUIDString }>>('/allocations', params)).data.allocationId;
}
