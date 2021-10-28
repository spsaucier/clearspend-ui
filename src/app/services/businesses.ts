import { service } from 'app/utils/service';
import { readBusinessID } from 'onboarding/storage';

import type { Businesses } from '../types/businesses';

export async function getBusiness() {
  const bid = readBusinessID();
  return (await service.get<Readonly<Businesses>>(`/businesses/${bid}`, { headers: { businessId: bid } })).data;
}
