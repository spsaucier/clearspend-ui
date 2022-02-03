import type { Allocation } from 'generated/capital';

interface AllocationWithChildNodes extends Allocation {
  childNodes: AllocationWithChildNodes[];
}
interface AllocationIndented extends Allocation {
  nestLevel: number;
}

export const byName = (a: Allocation, b: Allocation) =>
  a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1;

const createTree = (dataset: Allocation[]) => {
  const hashTable = {} as { [key: string]: AllocationWithChildNodes };
  dataset.forEach((allocation) => {
    hashTable[allocation.allocationId] = { ...allocation, childNodes: [] };
  });
  const dataTree = [] as AllocationWithChildNodes[];
  dataset.forEach((allocation) => {
    if (allocation.parentAllocationId) {
      hashTable[allocation.parentAllocationId]?.childNodes.push(hashTable[allocation.allocationId]!);
    } else {
      dataTree.push(hashTable[allocation.allocationId]!);
    }
  });
  return dataTree;
};

const treeToArray = (allocationTree: AllocationWithChildNodes[], nestLevel = 0) => {
  const allocationsArray = [] as AllocationIndented[];
  allocationTree.forEach((a) => {
    const { childNodes, ...allocation } = a;
    allocationsArray.push({ ...allocation, nestLevel });
    if (childNodes.length) {
      const children = treeToArray(childNodes, nestLevel + 1);
      children.forEach((c) => allocationsArray.push(c));
    }
  });
  return allocationsArray;
};

export const createSortedNestedArray = (allocations: Readonly<Allocation[]>) => {
  let list = [...allocations].sort(byName);
  const tree = createTree(list);
  const newList = treeToArray(tree);
  return newList;
};
