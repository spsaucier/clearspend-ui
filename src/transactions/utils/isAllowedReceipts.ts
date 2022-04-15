import type { Merchant } from 'generated/capital';

import type { ActivityStatus } from '../types';

const STATUSES: ActivityStatus[] = ['PENDING', 'APPROVED', 'PROCESSED'];

export function isAllowedReceipts(merchant: Merchant | undefined, status: ActivityStatus | undefined): boolean {
  return !!merchant && !!status && STATUSES.includes(status);
}
