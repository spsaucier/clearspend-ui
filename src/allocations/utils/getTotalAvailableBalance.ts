import type { Allocation } from 'generated/capital';

import { getAvailableBalance } from './getAvailableBalance';

export function getTotalAvailableBalance(allocations: readonly Readonly<Allocation>[] | null): number {
  if (!allocations) return 0;
  return allocations.reduce<number>((sum, curr) => sum + getAvailableBalance(curr), 0);
}
