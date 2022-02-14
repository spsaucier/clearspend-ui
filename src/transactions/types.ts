import type { AccountActivityResponse, Merchant } from 'generated/capital';

export type ActivityStatus = Required<AccountActivityResponse>['status'];
export type MccGroup = Required<Merchant>['merchantCategoryGroup'];
