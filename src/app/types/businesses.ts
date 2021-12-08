import type { UUIDString, Address } from './common';

export enum BusinessType {
  LLC = 'LLC',
  LLP = 'LLP',
  S_CORP = 'S_CORP',
  C_CORP = 'C_CORP',
  B_CORP = 'B_CORP',
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  T_501_C_3 = '_501_C_3',
}

export enum OnboardingStep {
  BUSINESS_OWNERS = 'BUSINESS_OWNERS',
  LINK_ACCOUNT = 'LINK_ACCOUNT',
  REVIEW = 'REVIEW',
  SOFT_FAIL = 'SOFT_FAIL',
  TRANSFER_MONEY = 'TRANSFER_MONEY',
  // COMPLETE = 'COMPLETE',
}

export enum KnowBusinessStatus {
  FAIL = 'FAIL',
  PASS = 'PASS',
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
}

export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ONBOARDING = 'ONBOARDING',
  SUSPENDED = 'SUSPENDED',
}

export interface Businesses {
  address: Readonly<Address>;
  businessId: UUIDString;
  businessPhone: string;
  businessType: BusinessType;
  employerIdentificationNumber: string;
  knowYourBusinessStatus: KnowBusinessStatus;
  legalName: string;
  onboardingStep: OnboardingStep;
  status: BusinessStatus;
}
