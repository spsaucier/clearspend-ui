import { service } from 'app/utils/service';

import type { PageResponse } from '../types/common';
import type { AccountActivity, AccountActivityRequest } from '../types/activity';

export async function getAccountActivity(params: Readonly<AccountActivityRequest>) {
  return (await service.post<PageResponse<readonly Readonly<AccountActivity>[]>>('/account-activity', params)).data;
}
