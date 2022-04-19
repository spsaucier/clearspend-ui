import { service } from 'app/utils/service';
import type {
  AddChartOfAccountsMappingRequest,
  BusinessNotification,
  ChartOfAccounts,
  ChartOfAccountsMappingResponse,
  CodatAccountNestedResponse,
  CodatBankAccountsResponse,
  CodatCreateBankAccountResponse,
  CreateCreditCardRequest,
  ExpenseCategory,
  GetChartOfAccountsMappingResponse,
  PagedDataSyncLogResponse,
  SetCreditCardRequest,
  SyncCountResponse,
  SyncLogRequest,
  SyncTransactionResponse,
} from 'generated/capital';

import type { UpdateBusinessAccountingStepRequest, UpdateAutoUpdatesStatusRequest } from './types';

export async function getCompanyConnection(): Promise<boolean> {
  return (await service.get<Readonly<boolean>>(`/codat/connection-status`)).data;
}

export async function syncTransaction(transactionId: string) {
  return (await service.post<Readonly<SyncTransactionResponse>>(`/codat/sync/${transactionId}`)).data;
}

export async function syncMultipleTransactions(transactionIds: string[]) {
  return (await service.post<Readonly<SyncTransactionResponse[]>>(`/codat/sync`, transactionIds)).data;
}

export async function syncAllTransactions() {
  return (await service.post<Readonly<SyncTransactionResponse[]>>('/codat/sync-all')).data;
}

export async function getCodatCreditCards() {
  return (await service.get<Readonly<CodatBankAccountsResponse>>(`/codat/bank-accounts`)).data;
}

export async function postCodatCreditCard(params: Readonly<CreateCreditCardRequest>) {
  return (await service.post<Readonly<CodatCreateBankAccountResponse>>(`/codat/bank-accounts`, params)).data;
}

export async function setCodatCreditCardforBusiness(params: Readonly<SetCreditCardRequest>) {
  return (await service.put<Readonly<Boolean>>(`/codat/bank-accounts`, params)).data;
}

export async function postAccountingStepToBusiness(params: Readonly<UpdateBusinessAccountingStepRequest>) {
  return (await service.post<Readonly<UpdateBusinessAccountingStepRequest>>(`/businesses/accounting-step`, params))
    .data;
}

export async function postAutoUpdatesStatus(params: Readonly<UpdateAutoUpdatesStatusRequest>) {
  return (await service.post<Readonly<UpdateAutoUpdatesStatusRequest>>(`/businesses/auto-updates-status`, params)).data;
}

export async function deleteIntegrationConnection() {
  await service.remove('/codat/connection');
}

export async function getExpenseCategories() {
  return (await service.get<readonly Readonly<ExpenseCategory>[]>('/expense-categories/list')).data;
}

export async function getIntegrationExpenseCategories() {
  return (await service.get<Readonly<CodatAccountNestedResponse>>('/codat/chart-of-accounts/expense')).data;
}

export async function getIntegrationExpenseCategoryMappings() {
  return (await service.get<Readonly<GetChartOfAccountsMappingResponse>>('/chart-of-accounts/mappings')).data;
}

export async function getSyncableTransactionCount() {
  return (await service.get<Readonly<SyncCountResponse>>('/codat/sync-count')).data;
}

export async function postIntegrationExpenseCategoryMappings(
  params: Readonly<AddChartOfAccountsMappingRequest | null>[],
) {
  return (await service.post<Readonly<ChartOfAccountsMappingResponse>>('/chart-of-accounts/mappings', params)).data;
}

export async function deleteIntegrationExpenseCategoryMappings() {
  await service.remove('/chart-of-accounts/mappings');
}
export async function getSyncLogs(params: Readonly<SyncLogRequest>) {
  return (await service.post<Readonly<PagedDataSyncLogResponse>>('/codat/sync-log', params)).data;
}

export async function deleteCompanyConnection() {
  return (await service.remove<Readonly<boolean>>(`/codat/connection`)).data;
}

export async function disableCategories(expenseCategoryIds: (string | undefined)[]) {
  return (await service.post<Readonly<ExpenseCategory>[]>('/expense-categories/disable', expenseCategoryIds)).data;
}

export async function updateChartOfAccounts() {
  return (await service.post<Readonly<ChartOfAccounts>>('/chart-of-accounts/update')).data;
}

export async function getSavedChartOfAccounts() {
  return (await service.get<Readonly<CodatAccountNestedResponse>>('/chart-of-accounts/stored')).data;
}

export async function getChartOfAccountsChangeNumber() {
  return (await service.get<Readonly<number>>('/chart-of-accounts/total-changes')).data;
}

export async function getUpdateNotifications() {
  return (await service.get<Readonly<BusinessNotification[]>>('/business-notification/chart-of-accounts')).data;
}

export async function acceptChartOfAccountsNotifications() {
  return (await service.post<Readonly<BusinessNotification>>('/business-notification/accept-chart-of-accounts')).data;
}
