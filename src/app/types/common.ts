import type { Amount } from 'generated/capital';

export enum AppEvent {
  Logout = 'logout',
}

export interface SignAmount extends Amount {
  negative: boolean;
  positive: boolean;
}
