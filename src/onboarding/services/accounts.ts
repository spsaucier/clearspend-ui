import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types';

export async function getAccounts(bid: UUIDString) {
  return (await service.get('/business-bank-accounts', { headers: { businessId: bid } })).data;
}

export async function getLinkToken(bid: UUIDString) {
  return (await service.get<string>('/business-bank-accounts/link-token', { headers: { businessId: bid } })).data;
}
