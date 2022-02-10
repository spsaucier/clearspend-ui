import axios from 'axios';

import { RespType, service } from 'app/utils/service';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  ChartDataRequest,
  ChartDataResponse,
  DashboardGraphData,
  GraphDataRequest,
  PagedDataAccountActivityResponse,
} from 'generated/capital';
import type { ReceiptVideModel } from 'transactions/components/TransactionPreview/ReceiptsView';

export async function getAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<PagedDataAccountActivityResponse>('/account-activity', params)).data;
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

export async function setActivityNote(activityId: string, notes: string) {
  return (await service.patch<Readonly<AccountActivityResponse>>(`/users/account-activity/${activityId}`, { notes }))
    .data;
}

export async function uploadReceiptForActivity(receiptData: FormData) {
  return (await service.post<Readonly<{ receiptId: string }>>('/images/receipts', receiptData)).data;
}

export async function linkReceiptToActivity(activityId: string, receiptId: string) {
  return (await service.post<void>(`/users/account-activity/${activityId}/receipts/${receiptId}/link`)).data;
}

export const viewReceipt = async (receiptId: string): Promise<ReceiptVideModel> => {
  const receiptData = await axios.get<Blob>(`api/images/receipts/${receiptId}`, {
    responseType: 'blob',
  });
  return { uri: URL.createObjectURL(receiptData.data), receiptId: receiptId };
};

export const deleteReceipt = async (receiptId: string) => {
  const result = await axios.delete(`api/users/receipts/${receiptId}/delete`);
  return result;
};
