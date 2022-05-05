import type { AccountSetupStep } from 'app/types/businesses';

export interface UpdateBusinessAccountingStepResponse {
  businessId: string;
  accountingSetupStep: AccountSetupStep;
}

export interface UpdateBusinessAccountingStepRequest {
  accountingSetupStep: AccountSetupStep;
}

export interface UpdateAutoCreateExpenseCategoriesRequest {
  autoCreateExpenseCategories: Boolean;
}

export interface getClosestVendorsRequest {
  limit: number;
  target: string;
}
