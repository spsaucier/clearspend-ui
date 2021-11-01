import type { UUIDString, Amount } from 'app/types/common';

export enum AccountType {
  BUSINESS = 'BUSINESS',
  ALLOCATION = 'ALLOCATION',
  CARD = 'CARD',
}

export interface Account {
  accountId: UUIDString;
  businessId: UUIDString;
  ledgerAccountId: UUIDString;
  type: AccountType;
  ownerId: UUIDString;
  ledgerBalance: Readonly<Amount>;
}

export interface Allocation {
  allocationId: UUIDString;
  programId: UUIDString;
  name: string;
  account: Readonly<Account>;
  parentAllocationId?: UUIDString;
}

export interface CreateAllocation {
  programId: UUIDString;
  name: string;
  amount: Readonly<Amount>;
  parentAllocationId?: UUIDString;
}
