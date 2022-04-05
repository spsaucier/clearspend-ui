import type { Allocation } from 'generated/capital';

import { allocationWithID } from './allocationWithID';

export function getParentsChain(
  allocations: readonly Readonly<Allocation>[],
  from: Readonly<Allocation> | undefined,
  includeRoot = true,
): readonly Allocation[] {
  let next = from;
  const result: Allocation[] = [];

  while (next?.parentAllocationId) {
    const item = allocations.find(allocationWithID(next.parentAllocationId));
    if (item && (includeRoot || item.parentAllocationId)) result.push(item);
    next = item;
  }

  return result.reverse();
}
