import type { ControllerError } from 'generated/capital';

export interface ExceptionData {
  data: ControllerError;
}

export enum IdentifierType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum ProspectStatus {
  NEW = 'NEW',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  MOBILE_VERIFIED = 'MOBILE_VERIFIED',
  COMPLETED = 'COMPLETED',
}