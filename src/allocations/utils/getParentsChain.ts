import type { Allocation } from 'generated/capital';

import { allocationWithID } from './allocationWithID';

export function getParentsChain(
  allocations: readonly Allocation[],
  from?: Readonly<Allocation>,
): readonly Allocation[] {
  let next = from;
  const result: Allocation[] = [];

  while (next?.parentAllocationId) {
    const item = allocations.find(allocationWithID(next.parentAllocationId));

    if (item) {
      result.push(item);
      next = item;
    }
  }

  return result;
}
