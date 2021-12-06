import type { UUIDString, Address, PageRequest, PageResponse } from 'app/types/common';
import type { CardInfo } from 'app/types/activity';

export interface CreateUser {
  firstName: string;
  lastName: string;
  address?: Readonly<Address>;
  email: string;
  phone?: string;
  generatePassword?: boolean;
}

export interface CreateUserResp {
  userId: UUIDString;
  password: string | null;
}

export enum UserType {
  EMPLOYEE = 'EMPLOYEE',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
}

export interface BaseUser {
  userId: UUIDString;
  type: UserType;
  firstName: string;
  lastName: string;
}

export interface User extends BaseUser {
  businessId: UUIDString;
  address: Readonly<Address> | null;
  email: string;
  phone: string;
}

export interface SearchUserRequest {
  pageRequest: Readonly<PageRequest<string>>; // TODO string to enum
}

export interface SearchUser {
  userData: Readonly<BaseUser>;
  email: string;
  cardInfoList: readonly Readonly<CardInfo>[];
}

export type SearchUserResponse = Readonly<PageResponse<readonly Readonly<SearchUser>[]>>;
