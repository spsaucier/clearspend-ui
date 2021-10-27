import { service } from 'app/utils/service';
import { readBusinessID } from 'onboarding/storage';

import type { IssueCard } from './types';

export async function saveCard(params: Readonly<IssueCard>) {
  return (await service.post('/cards', params, { headers: { businessId: readBusinessID() } })).data;
}
