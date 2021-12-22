import { service } from 'app/utils/service';
import type {
  AccountActivityRequest,
  PagedDataAccountActivityResponse,
  GraphDataRequest,
  DashboardGraphData,
  ChartDataRequest,
  ChartDataResponse,
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
