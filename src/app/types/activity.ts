import type { UUIDString, SignAmount, PageRequest } from './common';

export interface CardDetails {
  cardBin: string | null;
  cardOwner: string;
}

export enum MerchantType {
  UTILITIES = 'UTILITIES',
  GROCERIES = 'GROCERIES',
  RESTAURANTS = 'RESTAURANTS',
  OTHERS = 'OTHERS',
}

export interface Merchant {
  name: string | null;
  type: MerchantType | null;
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

export interface AccountActivity {
  activityTime: DateString;
  accountName: string | null;
  card: Readonly<CardDetails>;
  merchant: Readonly<Merchant>;
  type: ActivityType;
  amount: Readonly<SignAmount>;
}

export enum ActivityOrderFields {
  DATE = 'DATE',
  AMOUNT = 'AMOUNT',
}

export interface AccountActivityRequest {
  allocationId?: UUIDString;
  accountId?: UUIDString;
  type?: ActivityType;
  from: DateString;
  to: DateString;
  pageRequest: Readonly<PageRequest<ActivityOrderFields>>;
}
