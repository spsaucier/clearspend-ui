import type {
  CodatBankAccountResponse,
  CodatCreateCreditCardRequest,
  CodatCreateCreditCardResponse,
} from 'app/types/creditCard';
import { service } from 'app/utils/service';
import type { ExpenseCategory } from 'generated/capital';

import type {
  IntegrationAccountResponse,
  IntegrationExpenseAccountMappingResponse,
  SyncLogRequest,
  SyncLogResponse,
} from './components/ChartOfAccountsData/types';
import type { IntegrationAccountMapping } from './components/ChartOfAccountsTable/types';
import type { UpdateBusinessAccountingStepRequest } from './types';

export async function getCompanyConnection(): Promise<boolean> {
  return (await service.get<Readonly<boolean>>(`/codat/connection-status`)).data;
}

export async function syncTransaction(transactionId: string) {
  return (await service.post<Readonly<boolean>>(`/codat/sync/${transactionId}`)).data;
}

export async function getCodatCreditCards() {
  return (await service.get<Readonly<CodatBankAccountResponse>>(`/codat/bank-accounts`)).data;
}

export async function postCodatCreditCard(params: Readonly<CodatCreateCreditCardRequest>) {
  return (await service.post<Readonly<CodatCreateCreditCardResponse>>(`/codat/bank-accounts`, params)).data;
}

export async function postAccountingStepToBusiness(params: Readonly<UpdateBusinessAccountingStepRequest>) {
  return (await service.post<Readonly<UpdateBusinessAccountingStepRequest>>(`/businesses/accounting-step`, params))
    .data;
}

export async function deleteIntegrationConnection() {
  await service.remove('/codat/connection');
}

export async function getExpenseCategories() {
  return (await service.get<readonly Readonly<ExpenseCategory>[]>('/expense-categories/list')).data;
}

export async function getIntegrationExpenseCategories() {
  return (await service.get<Readonly<IntegrationAccountResponse>>('/codat/chart-of-accounts/expense')).data;
}

export async function getIntegrationExpenseCategoryMappings() {
  return (await service.get<Readonly<IntegrationExpenseAccountMappingResponse>>('/chart-of-accounts/mappings')).data;
}

export async function postIntegrationExpenseCategoryMappings(params: Readonly<IntegrationAccountMapping | null>[]) {
  return (await service.post<Readonly<IntegrationExpenseAccountMappingResponse>>('/chart-of-accounts/mappings', params))
    .data;
}

export async function deleteIntegrationExpenseCategoryMappings() {
  await service.remove('/chart-of-accounts/mappings');
}
export async function getSyncLogs(params: Readonly<SyncLogRequest>) {
  return (await service.post<Readonly<SyncLogResponse>>('/codat/sync-log', params)).data;
}

export async function deleteCompanyConnection() {
  return (await service.remove<Readonly<boolean>>(`/codat/connection`)).data;
}
