interface Allocation {
  parentAllocationId?: string;
}

export function getRootAllocation<T extends Allocation>(items: readonly Readonly<T>[] | null): Readonly<T> | undefined {
  return items?.find((item) => !item.parentAllocationId);
}
