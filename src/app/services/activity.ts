import type { FileTypes } from 'app/types/common';
import { RespType, service } from 'app/utils/service';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  ChartDataRequest,
  ChartDataResponse,
  DashboardGraphData,
  GraphDataRequest,
  LedgerActivityRequest,
  PagedDataLedgerActivityResponse,
  PagedDataAccountActivityResponse,
  UpdateAccountActivityRequest,
} from 'generated/capital';
import type { ReceiptVideModel } from 'transactions/containers/TransactionPreview/ReceiptsView';

export async function getAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<PagedDataAccountActivityResponse>('/account-activity', params)).data;
}

export async function getLedgerActivity(params: Readonly<LedgerActivityRequest>) {
  return (await service.post<PagedDataLedgerActivityResponse>('/account-activity/ledger', params)).data;
}

export async function exportAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<Blob>('/account-activity/export-csv', params, { respType: RespType.blob })).data;
}

export async function getGraphData(params: Readonly<GraphDataRequest>) {
  return (await service.post<Readonly<DashboardGraphData>>('/account-activity/graph-data', params)).data;
}

export async function getSpendingByCategory(params: Readonly<ChartDataRequest>) {
  return (await service.post<Readonly<ChartDataResponse>>('/account-activity/category-spend', params)).data;
}

export async function getActivityById(activityId: string) {
  return (await service.get<Readonly<AccountActivityResponse>>(`/account-activity/${activityId}`)).data;
}

export async function setActivityNote(activityId: string, activityUpdate: UpdateAccountActivityRequest) {
  return (
    await service.patch<Readonly<AccountActivityResponse>>(`/users/account-activity/${activityId}`, activityUpdate)
  ).data;
}

export async function setActivityExpenseCategory(activityId: string, expenseCategoryId: string | null, notes: string) {
  return (
    await service.patch<Readonly<AccountActivityResponse>>(`/users/account-activity/${activityId}`, {
      notes,
      expenseCategoryId,
    })
  ).data;
}

export async function uploadReceiptForActivity(receiptData: FormData) {
  return (await service.post<Readonly<{ receiptId: string }>>('/images/receipts', receiptData)).data;
}

export async function linkReceiptToActivity(activityId: string, receiptId: string) {
  return (await service.post<void>(`/users/account-activity/${activityId}/receipts/${receiptId}/link`)).data;
}

export const viewReceipt = async (receiptId: string): Promise<ReceiptVideModel> => {
  const data = (await service.get<Blob>(`/images/receipts/${receiptId}`, { respType: RespType.blob })).data;
  return { receiptId, type: data.type as FileTypes, uri: URL.createObjectURL(data) };
};

export const deleteReceipt = async (receiptId: string) => {
  await service.remove(`/users/receipts/${receiptId}/delete`);
};
