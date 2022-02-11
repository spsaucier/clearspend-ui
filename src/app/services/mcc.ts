import type { MccGroup } from 'cards/types';

import { service } from '../utils/service';

export async function getMCCGroups() {
  return (await service.get<readonly Readonly<MccGroup>[]>('/mcc-groups')).data;
}
