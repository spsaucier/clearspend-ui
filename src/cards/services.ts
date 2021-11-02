import { service } from 'app/utils/service';

import type { IssueCard } from './types';

export async function saveCard(params: Readonly<IssueCard>) {
  return (await service.post('/cards', params)).data;
}
