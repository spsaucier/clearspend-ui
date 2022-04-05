import type { Allocation } from 'generated/capital';

export interface AllocationData {
  allocation: Readonly<Allocation>;
  balance: number;
  path: string;
}

export interface OtherData {
  allocations: readonly Readonly<Allocation>[];
  balance: number;
}

export type RenderList = Readonly<AllocationData | OtherData>[];
