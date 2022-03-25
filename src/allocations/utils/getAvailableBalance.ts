import type { Allocation } from 'generated/capital';

export function getAvailableBalance(allocation: Readonly<Allocation>): number {
  return allocation.account.availableBalance?.amount || 0;
}
