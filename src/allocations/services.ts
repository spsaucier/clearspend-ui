import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';

import type { Allocation, CreateAllocation } from './types';

export async function getAllocations() {
  // TODO
  return (await service.post<readonly Readonly<Allocation>[]>('/businesses/allocations', { name: '' })).data;
}

export async function saveAllocation(params: Readonly<CreateAllocation>) {
  return (await service.post<Readonly<{ allocationId: UUIDString }>>('/allocations', params)).data.allocationId;
}