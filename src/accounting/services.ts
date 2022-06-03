import { service } from 'app/utils/service';
import type {
  AddChartOfAccountsMappingRequest,
  BusinessNotification,
  ChartOfAccounts,
  ChartOfAccountsMappingResponse,
  CodatAccountNestedResponse,
  CodatBankAccountsResponse,
  CodatCreateBankAccountResponse,
  ExpenseCategory,
  GetChartOfAccountsMappingResponse,
  GetSuppliersResponse,
  SyncCountResponse,
  SyncTransactionResponse,
  CreateAssignSupplierRequest,
  CreateAssignSupplierResponse,
  CodatCategory,
  CodatBankAccount,
  AuditLogDisplayValue,
  SetCategoryNamesRequest,
} from 'generated/capital';

import type {
  UpdateBusinessAccountingStepRequest,
  UpdateAutoCreateExpenseCategoriesRequest,
  getClosestVendorsRequest,
} from './types';

export async function getCompanyConnection(): Promise<boolean> {
  return (await service.get<Readonly<boolean>>(`/codat/connection-status`)).data;
}

export async function syncTransaction(transactionId: string) {
  return (await service.post<Readonly<SyncTransactionResponse>>(`/codat/sync/${transactionId}`)).data;
}

export async function unlockTransaction(transactionId: string) {
  return (await service.post<Readonly<SyncTransactionResponse>>(`/users/account-activity/${transactionId}/unlock`))
    .data;
}

export async function syncMultipleTransactions(transactionIds: string[]) {
  return (await service.post<Readonly<SyncTransactionResponse[]>>(`/codat/sync`, transactionIds)).data;
}

export async function syncAllTransactions() {
  return (await service.post<Readonly<SyncTransactionResponse[]>>('/codat/sync-all')).data;
}

export async function getCodatCreditCards() {
  return (await service.get<Readonly<CodatBankAccountsResponse>>(`/codat/bank-accounts`)).data
    .results as readonly Required<Readonly<CodatBankAccount>>[];
}

export async function addBusinessCreditCard(accountName: string) {
  return (await service.post<Readonly<CodatCreateBankAccountResponse>>(`/codat/bank-accounts`, { accountName })).data;
}

export async function updateBusinessCreditCard(accountId: string) {
  return (await service.put<Readonly<Boolean>>(`/codat/bank-accounts`, { accountId })).data;
}

export async function postAccountingStepToBusiness(params: Readonly<UpdateBusinessAccountingStepRequest>) {
  return (await service.post<Readonly<UpdateBusinessAccountingStepRequest>>(`/businesses/accounting-step`, params))
    .data;
}

export async function postAutoCreateExpenseCategories(params: Readonly<UpdateAutoCreateExpenseCategoriesRequest>) {
  return (
    await service.post<Readonly<UpdateAutoCreateExpenseCategoriesRequest>>(
      `/businesses/auto-create-expense-categories`,
      params,
    )
  ).data;
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

export async function getSyncTransactionCount() {
  return (await service.get<Readonly<SyncCountResponse>>('/codat/sync-count')).data;
}

export async function postIntegrationExpenseCategoryMappings(
  params: readonly Readonly<AddChartOfAccountsMappingRequest>[],
) {
  return (await service.post<Readonly<ChartOfAccountsMappingResponse>>('/chart-of-accounts/mappings', params)).data;
}

export async function deleteIntegrationExpenseCategoryMappings() {
  await service.remove('/chart-of-accounts/mappings');
}
export async function getAuditLogs(limit: number) {
  return (await service.get<Readonly<AuditLogDisplayValue[]>>(`/codat/audit-log?limit=${limit}`)).data;
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

export async function getRecentUpdateNotifications() {
  return (await service.get<Readonly<BusinessNotification[]>>('/business-notification/chart-of-accounts/recent')).data;
}

export async function acceptChartOfAccountsNotifications() {
  return (await service.post<Readonly<BusinessNotification>>('/business-notification/accept-chart-of-accounts')).data;
}

export async function resyncChartOfAccounts() {
  return (await service.post<Readonly<boolean>>('/chart-of-accounts/resync')).data;
}

export async function getClosestVendorsToTarget(params: Readonly<getClosestVendorsRequest>) {
  return (
    await service.get<Readonly<GetSuppliersResponse>>(
      `/codat/accounting-suppliers?target=${params.target}&limit=${params.limit}`,
    )
  ).data;
}

export async function createNewVendorForActivity(params: Readonly<CreateAssignSupplierRequest>) {
  return (await service.post<Readonly<CreateAssignSupplierResponse>>(`/codat/create-assign-vendor`, params)).data;
}

export async function getClassesForBusiness() {
  return (await service.get<Readonly<CodatCategory[]>>('/codat/classes')).data;
}

export async function getLocationsForBusiness() {
  return (await service.get<Readonly<CodatCategory[]>>('/codat/locations')).data;
}

export async function postClearspendNameForCategories(request: SetCategoryNamesRequest[]) {
  return (await service.post<Readonly<boolean>>('/codat/category-names', request)).data;
}
