import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';

export function getDefaultExpanded(
  currentID: string,
  current: readonly Readonly<Allocation>[],
  items: readonly Readonly<Allocation>[],
) {
  const path: string[] = [];
  let item = items.find(allocationWithID(currentID));

  while (item?.parentAllocationId) {
    path.push(item.parentAllocationId);
    item = items.find(allocationWithID(item.parentAllocationId));
  }

  return current.reduce<Record<string, boolean>>((acc, curr) => {
    if (path.includes(curr.allocationId)) acc[curr.allocationId] = true;
    return acc;
  }, {});
}
