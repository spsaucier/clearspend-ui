import axios from 'axios';

import { service } from 'app/utils/service';
import type {
  AccountActivityRequest,
  PagedDataAccountActivityResponse,
  GraphDataRequest,
  DashboardGraphData,
  ChartDataRequest,
  ChartDataResponse,
  AccountActivityResponse,
} from 'generated/capital';

export async function getAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<PagedDataAccountActivityResponse>('/account-activity', params)).data;
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

export async function uploadReceiptForActivity(receiptData: FormData) {
  return (await service.post<Readonly<{ receiptId: string }>>('/images/receipts', receiptData)).data;
}

export async function linkReceiptToActivity(activityId: string, receiptId: string) {
  return (await service.post<void>(`/users/account-activity/${activityId}/receipts/${receiptId}/link`)).data;
}

export const viewReceipt = async (receiptId: string) => {
  const receiptData = await axios.get<Blob>(`api/images/receipts/${receiptId}`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(receiptData.data);
};
