export enum AppEvent {
  Logout = 'logout',
}

export type UUIDString = string & { __isUUIDString: true };

export interface Amount {
  currency: 'USD';
  amount: number;
}

export interface Address {
  streetLine1: string;
  streetLine2?: string;
  locality: string;
  region: string;
  postalCode: string;
  country: 'USA';
}
