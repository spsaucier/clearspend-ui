import type { JSXElement } from 'solid-js';

import { i18n } from '_common/api/intl';
import type { IconName } from '_common/components/Icon';

import type { ActivityStatus, MccGroup } from './types';

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

export const MERCHANT_CATEGORIES: Readonly<Record<MccGroup, { icon: keyof typeof IconName; name: JSXElement }>> = {
  CHILD_CARE: { icon: 'mcc-child-care', name: i18n.t('Child Care') },
  DIGITAL_GOODS: { icon: 'mcc-digital-goods', name: i18n.t('Digital Goods') },
  EDUCATION: { icon: 'mcc-education', name: i18n.t('Education') },
  ENTERTAINMENT: { icon: 'mcc-entertainment', name: i18n.t('Entertainment') },
  FOOD_BEVERAGE: { icon: 'mcc-food-and-beverage', name: i18n.t('Food & Beverage') },
  GAMBLING: { icon: 'mcc-gambling', name: i18n.t('Gambling') },
  GOVERNMENT: { icon: 'mcc-government', name: i18n.t('Government') },
  HEALTH: { icon: 'mcc-health', name: i18n.t('Health') },
  MEMBERSHIPS: { icon: 'mcc-memberships', name: i18n.t('Memberships') },
  MONEY_TRANSFER: { icon: 'mcc-money-transfer', name: i18n.t('Money Transfer') },
  SERVICES: { icon: 'mcc-services', name: i18n.t('Services') },
  SHOPPING: { icon: 'mcc-shopping', name: i18n.t('Shopping') },
  TRAVEL: { icon: 'mcc-travel', name: i18n.t('Travel') },
  UTILITIES: { icon: 'mcc-utilities', name: i18n.t('Utilities') },
  OTHER: { icon: 'mcc-utilities', name: i18n.t('Other') }, // TODO Update icon
};
