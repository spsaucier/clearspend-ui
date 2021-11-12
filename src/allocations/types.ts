import type { UUIDString, Amount } from 'app/types/common';
import type { Account } from 'app/types/accounts';

export interface Allocation {
  allocationId: UUIDString;
  programId: UUIDString;
  name: string;
  account: Readonly<Account>;
  parentAllocationId?: UUIDString;
}

export interface CreateAllocation {
  name: string;
  amount: Readonly<Amount>;
  parentAllocationId?: UUIDString;
}
