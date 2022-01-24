import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';
import { getParentsChain } from '../../utils/getParentsChain';

export function getDefaultExpanded(
  currentID: string,
  current: readonly Readonly<Allocation>[],
  items: readonly Readonly<Allocation>[],
) {
  const parents = getParentsChain(items, items.find(allocationWithID(currentID)));

  return current.reduce<Record<string, boolean>>((acc, curr) => {
    if (parents.some((item) => item.allocationId === curr.allocationId)) acc[curr.allocationId] = true;
    return acc;
  }, {});
}
