import { service } from 'app/utils/service';
import type { AccountActivityRequest, PagedDataAccountActivityResponse } from 'generated/capital';

export async function getAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<PagedDataAccountActivityResponse>('/account-activity', params)).data;
}
