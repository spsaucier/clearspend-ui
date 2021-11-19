import type { Allocation } from '../types';

export function getRootAllocation(items: readonly Readonly<Allocation>[] | null): Readonly<Allocation> | undefined {
  return items?.find((item) => !item.parentAllocationId);
}
