import type { AccountActivityResponse, LedgerActivityResponse, Merchant } from 'generated/capital';

export type ActivityStatus = Required<AccountActivityResponse>['status'];
export type ActivityType = 'NETWORK_CAPTURE' | 'NETWORK_AUTHORIZATION' | 'NETWORK_REFUND' | 'CARD_FUND_RETURN';
export type LedgerActivityType = Exclude<Required<LedgerActivityResponse>['type'], ActivityType>;
export type MccGroup = Required<Merchant>['merchantCategoryGroup'];
