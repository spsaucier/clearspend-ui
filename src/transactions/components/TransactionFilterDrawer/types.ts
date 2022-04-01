import type { AccountActivityRequest } from 'generated/capital';

import type { ActivityStatus } from '../../types';
import type { AmountRange } from '../../utils/filters';

export interface FormValues extends AmountRange {
  allocation: string | undefined;
  categories: string[];
  syncStatus: string[]; // TODO: still need API?
  status: ActivityStatus[];
  hasReceipt: boolean | undefined;
  date: ReadonlyDate[];
}

export type FormResult = Pick<
  AccountActivityRequest,
  'allocationId' | 'amount' | 'categories' | 'statuses' | 'withReceipt' | 'withoutReceipt' | 'from' | 'to'
>;
