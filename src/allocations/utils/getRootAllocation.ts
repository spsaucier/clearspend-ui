import type { AccessibleAllocation } from '../types';

interface PartialAllocation {
  parentAllocationId?: string;
  inaccessible?: boolean;
}

export function getRootAllocation<T extends PartialAllocation>(
  items: readonly Readonly<T>[] | null,
): Readonly<T> | undefined {
  return items?.find((item) => !item.parentAllocationId);
}

function getAccessibleRootAllocation<T extends PartialAllocation>(
  items: readonly Readonly<T>[] | null,
): Readonly<T> | undefined {
  return items?.find((item) => !item.parentAllocationId && !item.inaccessible);
}

export function getFirstAccessibleAllocation<T extends AccessibleAllocation>(
  items: readonly Readonly<T>[] | null,
): Readonly<T> | undefined {
  return getAccessibleRootAllocation(items) || items?.find((item) => !item.inaccessible);
}
