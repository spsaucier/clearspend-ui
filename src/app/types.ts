export type UUIDString = string & { __isUUIDString: true };

export interface Amount {
  currency: 'USD';
  amount: number;
}
