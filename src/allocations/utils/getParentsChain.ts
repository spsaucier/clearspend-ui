import type { Allocation } from 'generated/capital';

import { allocationWithID } from './allocationWithID';

interface Options {
  excludeRoot: boolean;
}

export function getParentsChain<T extends Allocation>(
  allocations: readonly Readonly<T>[],
  from: Readonly<T> | undefined,
  options?: Partial<Readonly<Options>>,
): readonly T[] {
  let next = from;
  const result: T[] = [];

  while (next?.parentAllocationId) {
    const item = allocations.find(allocationWithID(next.parentAllocationId));
    if (item && (!options?.excludeRoot || item.parentAllocationId)) result.push(item);
    next = item;
  }

  return result.reverse();
}
