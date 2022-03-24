import type { AccountActivityResponse, LedgerActivityResponse, Merchant } from 'generated/capital';

export type ActivityStatus = Required<AccountActivityResponse>['status'];
export type LedgerActivityType = Required<LedgerActivityResponse>['type'];
export type ActivityType = Required<AccountActivityResponse>['type'];
export type MccGroup = Required<Merchant>['merchantCategoryGroup'];
