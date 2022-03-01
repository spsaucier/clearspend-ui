import { defineMessages } from 'solid-i18n';

import { i18n } from '_common/api/intl';

import type { ActivityStatus } from '../types';

const messages = defineMessages({
  PENDING: { message: 'Pending' },
  DECLINED: { message: 'Declined' },
  APPROVED: { message: 'Approved' },
  CANCELED: { message: 'Canceled' },
  CREDIT: { message: 'Credit' },
  PROCESSED: { message: 'Processed' },
});

export function formatActivityStatus(value: ActivityStatus | undefined) {
  const message = value && messages[value];
  return message ? i18n.t(message) : '';
}
