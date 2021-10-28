import type { UUIDString, Address } from 'app/types/common';

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
}

export interface User {
  userId: UUIDString;
  type: UserType;
  firstName: string;
  lastName: string;
}
