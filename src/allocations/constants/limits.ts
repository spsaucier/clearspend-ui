import { i18n } from '_common/api/intl';
import type { SwitchGroupBoxItem } from 'app/components/SwitchGroupBox';

import { LimitPeriod } from '../types';
import type { Limits } from '../types';

export const DEFAULT_LIMITS: Readonly<Limits> = {
  [LimitPeriod.DAILY]: null,
  [LimitPeriod.MONTHLY]: null,
  [LimitPeriod.INSTANT]: null,
};

export const PAYMENT_TYPES: readonly Readonly<SwitchGroupBoxItem>[] = [
  { key: 'ATM', icon: 'channel-atm', name: i18n.t('ATM withdrawals') },
  { key: 'POS', icon: 'payment-card', name: i18n.t('Point of sale (POS)') },
  { key: 'MOTO', icon: 'channel-moto', name: i18n.t('Mail/telephone order') },
  { key: 'ONLINE', icon: 'channel-ecommerce', name: i18n.t('Online') },
];
