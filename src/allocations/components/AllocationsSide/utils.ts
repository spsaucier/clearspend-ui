import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';
import { getParentsChain } from '../../utils/getParentsChain';

export function getDefaultExpanded(
  currentID: string,
  current: readonly Readonly<Allocation>[],
  items: readonly Readonly<Allocation>[],
) {
  const currentAllocation = items.find(allocationWithID(currentID));
  const parents = getParentsChain(items, currentAllocation);

  return current.reduce<Record<string, boolean>>((acc, curr) => {
    if (parents.some((item) => item.allocationId === curr.allocationId)) {
      acc[curr.allocationId] = true;
    }
    return acc;
  }, {});
}
