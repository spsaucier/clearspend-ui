import type { AccountActivityResponse, LedgerActivityResponse, Merchant } from 'generated/capital';

export type ActivityStatus = Required<AccountActivityResponse>['status'];
export type SyncStatus = Required<AccountActivityResponse>['syncStatus'];
export type ActivityType = Required<LedgerActivityResponse>['type'];
export type TransactionType = 'NETWORK_CAPTURE' | 'NETWORK_AUTHORIZATION' | 'NETWORK_REFUND' | 'CARD_FUND_RETURN';
export type LedgerActivityType = Exclude<ActivityType, TransactionType>;
export type MccGroup = Required<Merchant>['merchantCategoryGroup'];
