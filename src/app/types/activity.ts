import type { UUIDString, SignAmount, PageRequest, PageResponse } from './common';

export interface CardDetails {
  cardId: UUIDString;
  lastFour?: string;
  allocationName: string;
  ownerFirstName: string;
  ownerLastName: string;
}

export enum MerchantType {
  UTILITIES = 'UTILITIES',
  GROCERIES = 'GROCERIES',
  RESTAURANTS = 'RESTAURANTS',
  OTHERS = 'OTHERS',
}

export interface Merchant {
  name: string;
  type: MerchantType;
  merchantNumber: string;
  merchantCategoryCode: number;
}

export enum ActivityType {
  BANK_LINK = 'BANK_LINK',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  BANK_DEPOSIT_RETURN = 'BANK_DEPOSIT_RETURN',
  BANK_WITHDRAWAL = 'BANK_WITHDRAWAL',
  BANK_WITHDRAWAL_RETURN = 'BANK_WITHDRAWAL_RETURN',
  BANK_UNLINK = 'BANK_UNLINK',
  REALLOCATE = 'REALLOCATE',
  NETWORK_PRE_AUTH = 'NETWORK_PRE_AUTH',
  NETWORK_FINANCIAL_AUTH = 'NETWORK_FINANCIAL_AUTH',
  NETWORK_REVERSAL = 'NETWORK_REVERSAL',
  NETWORK_SERVICE_FEE = 'NETWORK_SERVICE_FEE',
}

export interface ReceiptDetails {
  receiptId: UUIDString;
}

export interface AccountActivity {
  accountActivityId?: UUIDString;
  activityTime: DateString;
  accountName: string | null;
  card?: Readonly<Partial<CardDetails>>;
  merchant: Readonly<Partial<Merchant>>;
  type: ActivityType;
  amount: Readonly<SignAmount>;
  receipt: Readonly<Partial<ReceiptDetails>>;
}

export type AccountActivityResponse = Readonly<PageResponse<readonly Readonly<AccountActivity>[]>>;

export enum ActivityOrderFields {
  DATE = 'DATE',
  AMOUNT = 'AMOUNT',
}

export interface AccountActivityRequest {
  allocationId?: UUIDString;
  userId?: UUIDString;
  cardId?: UUIDString;
  searchText?: string;
  type?: ActivityType;
  from?: DateString;
  to?: DateString;
  pageRequest: Readonly<PageRequest<ActivityOrderFields>>;
}
