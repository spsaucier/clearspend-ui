import { ACTIVITY_TYPES } from '../constants';
import type { ActivityType, TransactionType } from '../types';

export function isActivityType(type: ActivityType | undefined): boolean {
  return ACTIVITY_TYPES.includes(type as TransactionType);
}
