import type { UUIDString, Address } from 'app/types';

export enum OnboardingStep {
  kyb,
  kyc,
  account,
  money,
}

export interface UpdateBusinessAccount {
  email: string;
  firstName: string;
  lastName: string;
}

export interface BusinessAccount {
  businessProspectId: UUIDString;
  otp: string; // TODO: Hope it's only for demo
}

export enum IdentifierType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export interface ConfirmOTP {
  identifierType: IdentifierType;
  otp: string;
}

export enum BusinessType {
  LLC = 'LLC',
  LLP = 'LLP',
  S_CORP = 'S_CORP',
  C_CORP = 'C_CORP',
  B_CORP = 'B_CORP',
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  T_501_C_3 = '_501_C_3',
}

export interface UpdateBusinessInfo {
  legalName: string;
  businessType: BusinessType;
  employerIdentificationNumber: string;
  businessPhone: string;
  address: Readonly<Address>;
}

export interface UpdateBusinessInfoResp {
  businessId: UUIDString;
  businessOwnerId: UUIDString;
}

export interface UpdateBusinessOwner {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  taxIdentificationNumber: string;
  email: string;
  address: Readonly<Address>;
}

export interface LinkToken {
  linkToken: string;
}

export interface LinkedBankAccounts {
  accountNumber: string;
  businessBankAccountId: UUIDString;
  routingNumber: string;
  name: null;
}
