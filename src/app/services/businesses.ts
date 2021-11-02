import { service } from 'app/utils/service';

import type { Businesses } from '../types/businesses';

export async function getBusiness() {
  return (await service.get<Readonly<Businesses>>(`/businesses`)).data;
}
