import type { UUIDString, Address } from 'app/types/common';
import type { BusinessType, Businesses } from 'app/types/businesses';

export interface UpdateBusinessAccount {
  email: string;
  firstName: string;
  lastName: string;
}

export enum ProspectStatus {
  NEW = 'NEW',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  MOBILE_VERIFIED = 'MOBILE_VERIFIED',
  COMPLETED = 'COMPLETED',
}

export interface BusinessAccount {
  businessProspectId: UUIDString;
  businessProspectStatus: ProspectStatus;
}

export enum IdentifierType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export interface ConfirmOTP {
  identifierType: IdentifierType;
  otp: string;
}

export interface UpdateBusinessInfo {
  legalName: string;
  businessType: BusinessType;
  employerIdentificationNumber: string;
  businessPhone: string;
  address: Readonly<Address>;
}

export interface UpdateBusinessInfoResp {
  business: Readonly<Businesses>;
  businessOwnerId: UUIDString;
}

export interface UpdateBusinessOwner {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  taxIdentificationNumber: string;
  email: string;
  address: Readonly<Address>;
  isOnboarding?: boolean;
}

export interface UpdateBusinessOwnerResponse {
  businessStatus: string;
  ownerStatus: string;
}

export interface LinkToken {
  linkToken: string;
}

export interface LinkedBankAccounts {
  accountNumber: string;
  businessBankAccountId: UUIDString;
  routingNumber: string;
  name: string;
}

export interface FormManualReview {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  taxIdentificationNumber: string;
  email: string;
  address: Readonly<Address>;
  isOnboarding?: boolean;
}

export interface ExceptionDataMessage {
  message: string;
}

export interface ExceptionData {
  data: ExceptionDataMessage;
}
