import type { MccGroup } from 'transactions/types';

import { service } from '../utils/service';

export async function getMCCGroups() {
  return (await service.get<readonly Readonly<MccGroup>[]>('/mcc-groups')).data.filter((item) => item !== 'OTHER');
}
