import { i18n } from '_common/api/intl';
import type { SwitchGroupBoxItem } from 'app/components/SwitchGroupBox';
import type { PaymentType } from 'cards/types';

import { LimitPeriod } from '../types';
import type { Limits } from '../types';

export const DEFAULT_LIMITS: Readonly<Limits> = {
  [LimitPeriod.DAILY]: null,
  [LimitPeriod.MONTHLY]: null,
  [LimitPeriod.INSTANT]: null,
};

export const PAYMENT_TYPES: readonly Readonly<SwitchGroupBoxItem<PaymentType>>[] = [
  { key: 'POS', icon: 'payment-card', name: i18n.t('Point of sale (POS)') },
  { key: 'ONLINE', icon: 'channel-ecommerce', name: i18n.t('Online') },
  { key: 'MANUAL_ENTRY', icon: 'keyboard', name: i18n.t('Manual entry') },
];
