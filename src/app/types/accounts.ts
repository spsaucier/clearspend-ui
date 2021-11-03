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
