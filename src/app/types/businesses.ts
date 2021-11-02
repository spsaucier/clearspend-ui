import type { User } from 'employees/types';

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
  TRANSFER_MONEY = 'TRANSFER_MONEY',
  // COMPLETE = 'COMPLETE',
}

export enum KnowBusinessStatus {
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
  FAIL = 'FAIL',
  PASS = 'PASS',
}

export enum BusinessStatus {
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
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

export interface BusinessOwner extends User {
  businessId: UUIDString;
  email: string;
  phone: string;
}
