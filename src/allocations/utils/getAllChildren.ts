import type { Allocation } from 'generated/capital';

import { allocationWithID } from './allocationWithID';

export function getAllChildren(
  allocations: readonly Allocation[],
  target: Allocation,
  includeTarget = false,
): Allocation[] {
  const result: Allocation[] = includeTarget ? [target] : [];

  function extract(next: Allocation): void {
    (next.childrenAllocationIds || []).forEach((id) => {
      const found = allocations.find(allocationWithID(id));

      if (found) {
        result.push(found);
        extract(found);
      }
    });
  }

  extract(target);
  return result;
}
