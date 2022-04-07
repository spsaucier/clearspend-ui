import type { AmountRange } from 'app/utils/filters';
import type { AccountActivityRequest } from 'generated/capital';

import type { ActivityStatus } from '../../types';

export interface FormValues extends AmountRange {
  allocation: string | undefined;
  categories: string[];
  syncStatus: string[]; // TODO: still need API?
  status: ActivityStatus[];
  hasReceipt: boolean | undefined;
  date: ReadonlyDate[];
  userId: string | undefined;
}

export type FormResult = Pick<
  AccountActivityRequest,
  'allocationId' | 'amount' | 'categories' | 'statuses' | 'withReceipt' | 'withoutReceipt' | 'from' | 'to' | 'userId'
>;
