import type { AccountSetupStep, AutoUpdatesStatus } from 'app/types/businesses';

export interface UpdateBusinessAccountingStepResponse {
  businessId: string;
  accountingSetupStep: AccountSetupStep;
}

export interface UpdateBusinessAccountingStepRequest {
  accountingSetupStep: AccountSetupStep;
}

export interface UpdateAutoUpdatesStatusRequest {
  autoUpdateStatus: AutoUpdatesStatus;
}
