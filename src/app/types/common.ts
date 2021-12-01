export enum AppEvent {
  Logout = 'logout',
}

export type UUIDString = string & { __isUUIDString: true };

export interface Amount {
  currency: 'USD';
  amount: number;
}

export interface SignAmount extends Amount {
  negative: boolean;
  positive: boolean;
}

export interface Address {
  streetLine1: string;
  streetLine2?: string;
  locality: string;
  region: string;
  postalCode: string;
  country: 'USA';
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface OrderBy<T = unknown> {
  item: T;
  direction: OrderDirection;
}

export interface PageRequest<T = unknown> {
  pageNumber: number;
  pageSize: number;
  orderBy?: OrderBy<T>;
}

export interface PageResponse<T = {}> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  content: T;
}
