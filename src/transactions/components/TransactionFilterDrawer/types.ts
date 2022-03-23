import type { AccountActivityRequest } from 'generated/capital';

import type { ActivityStatus } from '../../types';

export interface FormValues {
  amountMin: string;
  amountMax: string;
  categories: string[];
  syncStatus: string[]; // TODO: still need API?
  status: ActivityStatus[];
  hasReceipt: boolean | undefined;
  date: ReadonlyDate[];
}

export type FormResult = Pick<
  AccountActivityRequest,
  'amount' | 'categories' | 'statuses' | 'withReceipt' | 'withoutReceipt' | 'from' | 'to'
>;
