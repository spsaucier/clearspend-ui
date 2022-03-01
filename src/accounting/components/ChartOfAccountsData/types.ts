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
}

export interface FlattenedIntegrationAccount {
  id: string;
  name: string;
  fullyQualifiedCategory: string;
  fullyQualifiedName: string;
  type: string; // TODO: enum
  status: string; // TODO: enum
  level: number;
}

export interface IntegrationExpenseAccountMapping {
  accountRef: string;
  categoryIconRef: number;
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
