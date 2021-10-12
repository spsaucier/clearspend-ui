import type { UUIDString } from 'app/types';

export interface NewBusinessAccount {
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
