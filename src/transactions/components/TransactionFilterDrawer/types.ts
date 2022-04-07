import type { AmountRange } from 'app/utils/filters';
import type { AccountActivityRequest } from 'generated/capital';

import type { ActivityStatus, SyncStatus } from '../../types';

export interface FormValues extends AmountRange {
  allocation: string | undefined;
  categories: string[];
  syncStatus: SyncStatus[];
  status: ActivityStatus[];
  hasReceipt: boolean | undefined;
  date: ReadonlyDate[];
  userId: string | undefined;
}

export type FormResult = Pick<
  AccountActivityRequest,
  | 'allocationId'
  | 'amount'
  | 'categories'
  | 'syncStatus'
  | 'statuses'
  | 'withReceipt'
  | 'withoutReceipt'
  | 'from'
  | 'to'
  | 'userId'
>;
