import { AllocationRoles, AllocationUserRole } from 'allocations/types';
import type { Allocation, User } from 'generated/capital';

export interface AllocationWithChildNodes extends Allocation {
  childNodes: AllocationWithChildNodes[];
}
interface AllocationIndented extends Allocation {
  nestLevel: number;
}

export const byName = (a: Allocation, b: Allocation) =>
  a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1;

export const byUserLastName = (a: User, b: User) =>
  (a.lastName || '').toLocaleLowerCase() > (b.lastName || '').toLocaleLowerCase() ? 1 : -1;

export const byRoleLastName = (a: AllocationUserRole, b: AllocationUserRole) =>
  (a.user.lastName || '').toLocaleLowerCase() > (b.user.lastName || '').toLocaleLowerCase() ? 1 : -1;

export const hideEmployees = (a: AllocationUserRole) => a.role !== AllocationRoles.Employee;

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

export const createSortedNestedArray = (allocations: Readonly<Allocation[]> | null) => {
  if (!allocations) return [];
  let list = [...allocations].sort(byName).map((a) => ({ ...a, nestLevel: 0 }));
  const tree = createTree(list);
  if (!Object.keys(tree).length) return list;
  return treeToArray(tree);
};
