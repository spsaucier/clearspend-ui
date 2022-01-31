import type { Amount } from 'generated/capital';

export enum AppEvent {
  Logout = 'logout',
}

export interface SignAmount extends Amount {
  negative: boolean;
  positive: boolean;
}

export interface FieldError {
  code: string;
  message: string;
}

export type FieldErrors = Readonly<Record<string, readonly Readonly<FieldError>[]>>;
