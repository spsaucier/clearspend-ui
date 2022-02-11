import type { IconName } from '_common/components/Icon';

import type { ActivityStatus } from './types';

export const STATUS_ICONS: Record<ActivityStatus, keyof typeof IconName> = {
  APPROVED: 'confirm',
  PROCESSED: 'confirm',
  DECLINED: 'cancel',
  CANCELED: 'cancel',
  PENDING: 'clock',
  CREDIT: 'card',
};

export const STATUS_FILL_ICONS: Record<ActivityStatus, keyof typeof IconName> = {
  APPROVED: 'confirm-circle-filled',
  PROCESSED: 'confirm-circle-filled',
  DECLINED: 'cancel-rounded',
  CANCELED: 'cancel-rounded',
  PENDING: 'clock-fill',
  CREDIT: 'card-fill',
};
