import { service } from 'app/utils/service';

import type { AccountActivityResponse, AccountActivityRequest } from '../types/activity';

export async function getAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<AccountActivityResponse>('/account-activity', params)).data;
}
