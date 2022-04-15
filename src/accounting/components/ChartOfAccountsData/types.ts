import type { SyncLogStatus } from 'app/types/accounting';
import type { PageRequest } from 'generated/capital';

export interface IntegrationAccount {
  id: string;
  name: string;
  fullyQualifiedCategory: string;
  fullyQualifiedName: string;
  type: string; // TODO: enum
  status: string; // TODO: enum
  children: IntegrationAccount[];
  updateStatus: string;
}

export interface FlattenedIntegrationAccount {
  id: string;
  name: string;
  fullyQualifiedCategory: string;
  fullyQualifiedName: string;
  type: string; // TODO: enum
  status: string; // TODO: enum
  level: number;
  hasChildren: boolean;
}

export interface IntegrationExpenseAccountMapping {
  accountRef: string;
  categoryIconRef: number;
  expenseCategoryId: string;
}

export interface IntegrationExpenseAccountMappingResponse {
  results: IntegrationExpenseAccountMapping[];
}

export interface IntegrationAccountResponse {
  results: IntegrationAccount[];
}

export interface SyncLogRequest {
  pageRequest: PageRequest;
}

export interface SyncLogResponse {
  content: SyncLog[];
}

export interface SyncLog {
  startTime: Date;
  firstName: string;
  lastName: string;
  status: SyncLogStatus;
  transactionId: string;
}

export enum BusinessNotificationType {
  CHART_OF_ACCOUNTS_CREATED = 'CHART_OF_ACCOUNTS_CREATED',
  CHART_OF_ACCOUNTS_DELETED = 'CHART_OF_ACCOUNTS_DELETED',
  CHART_OF_ACCOUNTS_RENAMED = 'CHART_OF_ACCOUNTS_RENAMED',
  USER_ACCEPTED_COA_CHANGES = 'USER_ACCEPTED_COA_CHANGES',
}
export interface BusinessNotificationData {
  oldValue: string;
  newValue: string;
}
export interface BusinessNotification {
  type: BusinessNotificationType;
  data: BusinessNotificationData;
}
