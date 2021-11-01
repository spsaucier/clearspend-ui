import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';
import { readBusinessID } from 'onboarding/storage';

import type { Allocation, CreateAllocation } from './types';

export async function getAllocations() {
  return (
    await service.get<readonly Readonly<Allocation>[]>('/businesses/allocations', {
      headers: { businessId: readBusinessID() },
    })
  ).data;
}

export async function saveAllocation(params: Readonly<CreateAllocation>) {
  return (
    await service.post<Readonly<{ allocationId: UUIDString }>>('/allocations', params, {
      headers: { businessId: readBusinessID() },
    })
  ).data.allocationId;
}
