import type { JSXElement } from 'solid-js';

import type { DeclineDetails, PaymentDetails } from 'generated/capital';
import { i18n } from '_common/api/intl';

export const declineReasons: Partial<Readonly<Record<NonNullable<DeclineDetails['reason']>, JSXElement>>> = {
  INSUFFICIENT_FUNDS: i18n.t('Insufficient funds'),
  INVALID_CARD_STATUS: i18n.t('Invalid card status'),
  CARD_NOT_FOUND: i18n.t('Card not found'),
  LIMIT_EXCEEDED: i18n.t('Limit exceeded'),
  ADDRESS_POSTAL_CODE_MISMATCH: i18n.t('Address: Postal code mismatch'),
  CVC_MISMATCH: i18n.t('CVC mismatch'),
  EXPIRY_MISMATCH: i18n.t('Expiry mismatch'),
  ST_ACCOUNT_CLOSED: i18n.t('Account closed'),
  ST_ACCOUNT_FROZEN: i18n.t('Account frozen'),
  ST_BANK_ACCOUNT_RESTRICTED: i18n.t('Bank account restricted'),
  ST_BANK_OWNERSHIP_CHANGED: i18n.t('Bank ownership changed'),
  ST_COULD_NOT_PROCESS: i18n.t('Could not process'),
  ST_INVALID_ACCOUNT_NUMBER: i18n.t('Invalid account number'),
  ST_INCORRECT_ACCOUNT_HOLDER_NAME: i18n.t('Incorrect account-holder name'),
  ST_INVALID_CURRENCY: i18n.t('Invalid currency'),
  ST_NO_ACCOUNT: i18n.t('No account'),
  ST_DECLINED: i18n.t('Declined'),
  ST_FAILED: i18n.t('Failed'),
  ST_CANCELLED: i18n.t('Cancelled'),
  ST_UNKNOWN: i18n.t('Unknown reason'),
};

export const paymentType: Readonly<Record<NonNullable<PaymentDetails['paymentType']>, JSXElement>> = {
  POS: i18n.t('Point-of-sale'),
  ONLINE: i18n.t('Online'),
  MANUAL_ENTRY: i18n.t('Manual entry'),
};
