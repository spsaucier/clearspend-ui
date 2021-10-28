import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';
import { readBusinessID } from 'onboarding/storage';

import type { Allocation } from './types';

export async function getAllocations() {
  return (
    await service.get<readonly Readonly<Allocation>[]>('/businesses/allocations', {
      headers: { businessId: readBusinessID() },
    })
  ).data;
}

export async function saveAllocation(name: string, parent: string) {
  return (
    await service.post<Readonly<{ allocationId: UUIDString }>>(
      '/allocations',
      {
        programId: '033955d1-f18e-497e-9905-88ba71e90208',
        parentAllocationId: parent || undefined,
        currency: 'USD',
        name,
      },
      {
        headers: { businessId: readBusinessID() },
      },
    )
  ).data.allocationId;
}
