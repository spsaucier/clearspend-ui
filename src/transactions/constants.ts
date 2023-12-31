import type { JSXElement } from 'solid-js';
import { defineMessages } from 'solid-i18n';
import type { I18nMessage } from 'i18n-mini/lib/types';

import { i18n } from '_common/api/intl';
import type { IconName } from '_common/components/Icon';
import type { AccountActivityRequest, LedgerActivityRequest } from 'generated/capital';
import { DEFAULT_PAGE_REQUEST } from 'app/constants/common';

import type { ActivityStatus, ActivityType, TransactionType, LedgerActivityType, MccGroup } from './types';

export const ACTIVITY_PAGE_SIZE_STORAGE_KEY = 'activity_page_size';
export const LEDGER_PAGE_SIZE_STORAGE_KEY = 'ledger_page_size';

export const ACTIVITY_TYPES: readonly TransactionType[] = [
  'NETWORK_CAPTURE',
  'NETWORK_AUTHORIZATION',
  'NETWORK_REFUND',
  'CARD_FUND_RETURN',
];

export const ACCOUNTING_ACTIVITY_TYPES: readonly TransactionType[] = ['NETWORK_CAPTURE'];

export const LEDGER_TYPES: readonly LedgerActivityType[] = [
  'BANK_DEPOSIT_STRIPE',
  'BANK_DEPOSIT_ACH',
  'BANK_DEPOSIT_WIRE',
  'BANK_DEPOSIT_RETURN',
  'BANK_WITHDRAWAL',
  'BANK_WITHDRAWAL_RETURN',
  'MANUAL',
  'REALLOCATE',
  'FEE',
];

export const DEFAULT_TRANSACTIONS_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: { ...DEFAULT_PAGE_REQUEST },
  types: [...ACTIVITY_TYPES],
};

export const ACCOUNTING_TRANSACTIONS_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: { ...DEFAULT_PAGE_REQUEST },
  types: [...ACCOUNTING_ACTIVITY_TYPES],
};

export const DEFAULT_LEDGER_PARAMS: Readonly<LedgerActivityRequest> = {
  pageRequest: { ...DEFAULT_PAGE_REQUEST },
  types: [...LEDGER_TYPES],
};

export const DEFAULT_ACTIVITY_PARAMS: Readonly<LedgerActivityRequest> = {
  pageRequest: { ...DEFAULT_PAGE_REQUEST },
};

export const STATUS_ICONS: Record<ActivityStatus | 'NETWORK_REFUND', keyof typeof IconName> = {
  APPROVED: 'confirm',
  PROCESSED: 'confirm',
  DECLINED: 'cancel',
  CANCELED: 'cancel',
  PENDING: 'clock',
  CREDIT: 'card',
  NETWORK_REFUND: 'sync',
};

export const STATUS_FILL_ICONS: Record<ActivityStatus | 'NETWORK_REFUND', keyof typeof IconName> = {
  APPROVED: 'confirm-circle-filled',
  PROCESSED: 'confirm-circle-filled',
  DECLINED: 'cancel-rounded',
  CANCELED: 'cancel-rounded',
  PENDING: 'clock-fill',
  CREDIT: 'card-fill',
  NETWORK_REFUND: 'sync',
};

export const ACTIVITY_TYPE_TITLES: Readonly<Record<ActivityType, I18nMessage>> = defineMessages({
  NETWORK_CAPTURE: { message: 'Card Payment' },
  NETWORK_AUTHORIZATION: { message: 'Card Authorization' },
  NETWORK_REFUND: { message: 'Refund' },
  CARD_FUND_RETURN: { message: 'Card Funding Return' },
  BANK_DEPOSIT_STRIPE: { message: 'Transfer In' },
  BANK_DEPOSIT_ACH: { message: 'Transfer In (ACH)' },
  BANK_DEPOSIT_WIRE: { message: 'Transfer In (Wire)' },
  BANK_DEPOSIT_RETURN: { message: 'Transfer In Reversal' },
  BANK_WITHDRAWAL: { message: 'Transfer Out' },
  BANK_WITHDRAWAL_RETURN: { message: 'Transfer Out Reversal' },
  MANUAL: { message: 'Transfer' },
  REALLOCATE: { message: 'Reallocation' },
  FEE: { message: 'Fee' },
});

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
