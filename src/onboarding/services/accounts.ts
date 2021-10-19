import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types';

import type { LinkedBankAccounts } from '../types';

export async function getLinkToken(bid: UUIDString) {
  return (await service.get<string>('/business-bank-accounts/link-token', { headers: { businessId: bid } })).data;
}

export async function getBusinessAccounts(bid: UUIDString, linkToken: string) {
  const headers = { businessId: bid };
  await service.get(`/business-bank-accounts/accounts/${linkToken}`, { headers });
  return (await service.get<readonly Readonly<LinkedBankAccounts>[]>('/business-bank-accounts', { headers })).data;
}

export async function deposit(bid: UUIDString, accountId: string, amount: number) {
  return service.post(
    `/business-bank-accounts/${accountId}/transactions`,
    {
      bankAccountTransactType: 'DEPOSIT',
      amount: {
        currency: 'USD',
        amount: amount,
      },
    },
    {
      headers: { businessId: bid },
    },
  );
}
