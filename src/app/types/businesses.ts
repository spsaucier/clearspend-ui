import { i18n } from '_common/api/intl';

export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ONBOARDING = 'ONBOARDING',
  SUSPENDED = 'SUSPENDED',
}

// From ConvertClientBusinessProspectRequest['type']
export enum BusinessType {
  UNKNOWN = '',
  OTHER = 'OTHER',
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  SINGLE_MEMBER_LLC = 'SINGLE_MEMBER_LLC',
  MULTI_MEMBER_LLC = 'MULTI_MEMBER_LLC',
  PRIVATE_PARTNERSHIP = 'PRIVATE_PARTNERSHIP',
  PUBLIC_PARTNERSHIP = 'PUBLIC_PARTNERSHIP',
  PRIVATE_CORPORATION = 'PRIVATE_CORPORATION',
  PUBLIC_CORPORATION = 'PUBLIC_CORPORATION',
  INCORPORATED_NON_PROFIT = 'INCORPORATED_NON_PROFIT',
  INDIVIDUAL = 'INDIVIDUAL',
  ACCOUNTING_FIRM = 'ACCOUNTING_FIRM',
  BANK = 'BANK',
  CONSULTING_FIRM = 'CONSULTING_FIRM',
}

export const BusinessTypeI18n = {
  [BusinessType.OTHER]: String(i18n.t('Other/I’m not sure')),
  [BusinessType.UNKNOWN]: String(i18n.t('Unknown')),
  [BusinessType.SOLE_PROPRIETORSHIP]: String(i18n.t('Sole proprietorship')),
  [BusinessType.SINGLE_MEMBER_LLC]: String(i18n.t('Single-member LLC')),
  [BusinessType.MULTI_MEMBER_LLC]: String(i18n.t('Multi-member LLC')),
  [BusinessType.PRIVATE_PARTNERSHIP]: String(i18n.t('Private partnership')),
  [BusinessType.PUBLIC_PARTNERSHIP]: String(i18n.t('Public partnership')),
  [BusinessType.PRIVATE_CORPORATION]: String(i18n.t('Private corporation')),
  [BusinessType.PUBLIC_CORPORATION]: String(i18n.t('Public corporation')),
  [BusinessType.INCORPORATED_NON_PROFIT]: String(i18n.t('Incorporated non-profit')),
  [BusinessType.INDIVIDUAL]: String(i18n.t('Individual')),
  [BusinessType.ACCOUNTING_FIRM]: String(i18n.t('Accounting Firm')),
  [BusinessType.BANK]: String(i18n.t('Bank')),
  [BusinessType.CONSULTING_FIRM]: String(i18n.t('Consulting Firm')),
};

export enum OnboardingStep {
  BUSINESS = 'BUSINESS',
  BUSINESS_OWNERS = 'BUSINESS_OWNERS',
  LINK_ACCOUNT = 'LINK_ACCOUNT',
  REVIEW = 'REVIEW',
  SOFT_FAIL = 'SOFT_FAIL',
  TRANSFER_MONEY = 'TRANSFER_MONEY',
  COMPLETE = 'COMPLETE',
}

export enum RelationshipToBusiness {
  OWNER = 'OWNER',
  REPRESENTATIVE = 'REPRESENTATIVE',
  EXECUTIVE = 'EXECUTIVE',
  DIRECTOR = 'DIRECTOR',
  OTHER = 'OTHER',
}

export enum BusinessTypeCategory {
  UNKNOWN = 'UNKNOWN',
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  NONPROFIT = 'NONPROFIT',
}

export enum BusinessPartnerType {
  CLIENT = 'CLIENT',
  PARTNER = 'PARTNER',
  BOTH = 'BOTH',
}

export enum AccountSetupStep {
  AWAITING_SYNC = 'AWAITING_SYNC',
  ADD_CREDIT_CARD = 'ADD_CREDIT_CARD',
  MAP_CATEGORIES = 'MAP_CATEGORIES',
  SETUP_CLASSES = 'SETUP_CLASSES',
  SETUP_LOCATIONS = 'SETUP_LOCATIONS',
  COMPLETE = 'COMPLETE',
}

export enum AutoUpdatesStatus {
  ON = 'ON',
  OFF = 'OFF',
}
