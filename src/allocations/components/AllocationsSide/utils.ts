import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';
import { getParentsChain } from '../../utils/getParentsChain';
import { parentsChain } from '../AllocationSelect/utils';

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

export function getItemsByName(items: readonly Allocation[], search: string): readonly Allocation[] {
  const target = search.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(target));
}

export function getLevel(item: Readonly<Allocation>, items: readonly Readonly<Allocation>[]) {
  return Math.max(parentsChain(item, items).length - 1, 0);
}
