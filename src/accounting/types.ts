import type { AccountSetupStep } from 'app/types/businesses';

export interface UpdateBusinessAccountingStepResponse {
  businessId: string;
  accountingSetupStep: AccountSetupStep;
}

export interface UpdateBusinessAccountingStepRequest {
  accountingSetupStep: AccountSetupStep;
}

export enum AUTO_UPDATES_STATUS {
  ON = 'On',
  OFF = 'Off',
}
