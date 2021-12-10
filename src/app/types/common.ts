import type { Amount } from "generated/capital";

export enum AppEvent {
  Logout = 'logout',
}

export type UUIDString = string & { __isUUIDString: true };

export interface SignAmount extends Amount {
  negative: boolean;
  positive: boolean;
}
