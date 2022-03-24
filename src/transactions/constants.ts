import type { JSXElement } from 'solid-js';

import { i18n } from '_common/api/intl';
import type { IconName } from '_common/components/Icon';
import type { AccountActivityRequest } from 'generated/capital';

import type { ActivityStatus, ActivityType, MccGroup, LedgerActivityType } from './types';

export const ACTIVITY_PAGE_SIZE_STORAGE_KEY = 'activity_page_size';

export const DEFAULT_ACTIVITY_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
  types: ['NETWORK_CAPTURE', 'NETWORK_AUTHORIZATION'],
};

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

export const LEDGER_ACTIVITY_TYPES: Partial<Readonly<Record<LedgerActivityType, JSXElement>>> = {
  BANK_DEPOSIT: i18n.t('Deposit'),
  BANK_DEPOSIT_RETURN: i18n.t('Deposit Return'),
  BANK_LINK: i18n.t('Link'),
  BANK_UNLINK: i18n.t('Unlink'),
  BANK_WITHDRAWAL: i18n.t('Withdrawal'),
  BANK_WITHDRAWAL_RETURN: i18n.t('Withdrawal Return'),
  MANUAL: i18n.t('Transfer'),
  REALLOCATE: i18n.t('Reallocation'),
  FEE: i18n.t('Fee'),
};

export const ACTIVITY_TYPES: Readonly<Record<ActivityType, JSXElement>> = {
  BANK_DEPOSIT: i18n.t('Deposit'),
  BANK_DEPOSIT_RETURN: i18n.t('Deposit Return'),
  BANK_LINK: i18n.t('Link'),
  BANK_UNLINK: i18n.t('Unlink'),
  BANK_WITHDRAWAL: i18n.t('Withdrawal'),
  BANK_WITHDRAWAL_RETURN: i18n.t('Withdrawal Return'),
  MANUAL: i18n.t('Transfer'),
  NETWORK_AUTHORIZATION: i18n.t('Payment Hold'),
  NETWORK_CAPTURE: i18n.t('Payment Capture'),
  REALLOCATE: i18n.t('Reallocation'),
  FEE: i18n.t('Fee'),
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
  OTHER: { icon: 'merchant-services', name: i18n.t('Other') },
};
