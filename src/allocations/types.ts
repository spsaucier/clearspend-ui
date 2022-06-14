import type { UserData, UserRolesAndPermissionsRecord } from 'generated/capital';

export type AllocationPermissions = ValuesOf<Required<UserRolesAndPermissionsRecord>['allocationPermissions']>;
export type GlobalUserPermissions = ValuesOf<Required<UserRolesAndPermissionsRecord>['globalUserPermissions']>;

export enum AllocationRoles {
  Admin = 'Admin',
  Manager = 'Manager',
  ViewOnly = 'View only',
  Employee = 'Employee',
}

export interface AllocationUserRole {
  inherited: boolean;
  user: Readonly<UserData>;
  role: AllocationRoles;
}

export enum LimitPeriod {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  INSTANT = 'INSTANT',
}

export interface Limit {
  amount: string;
}

export interface Limits {
  [LimitPeriod.DAILY]: Readonly<Limit> | null;
  [LimitPeriod.MONTHLY]: Readonly<Limit> | null;
  [LimitPeriod.INSTANT]: Readonly<Limit> | null;
}

export interface FormLimits {
  categories: string[];
  channels: string[];
  purchasesLimits: Limits;
  international: boolean;
}
