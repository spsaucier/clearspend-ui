interface PartialAllocation {
  parentAllocationId?: string;
  allocationId?: string;
}

export function getRootAllocation<T extends PartialAllocation>(
  items: readonly Readonly<T>[] | null,
): Readonly<T> | undefined {
  return items?.find((item) => !item.parentAllocationId);
}
