import type { UpdateAllocationRequest } from 'generated/capital';

export enum LimitPeriod {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  INSTANT = 'INSTANT',
}

export interface Limit {
  amount: string;
}

export interface Limits {
  [LimitPeriod.DAILY]: Readonly<Limit> | null;
  [LimitPeriod.MONTHLY]: Readonly<Limit> | null;
  [LimitPeriod.INSTANT]: Readonly<Limit> | null;
}

export type ControlsData = Pick<
  Required<UpdateAllocationRequest>,
  'limits' | 'disabledMccGroups' | 'disabledTransactionChannels'
>;

export interface FormLimits {
  categories: string[];
  channels: string[];
  purchasesLimits: Limits;
}
