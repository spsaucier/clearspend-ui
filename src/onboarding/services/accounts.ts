import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types';

import type { LinkToken, LinkedBankAccounts } from '../types';

function getHeaders(bid: UUIDString) {
  return { headers: { businessId: bid } };
}

export async function getLinkToken(bid: UUIDString) {
  return (await service.get<LinkToken>('/business-bank-accounts/link-token', getHeaders(bid))).data.linkToken;
}

export async function getBusinessAccounts(bid: UUIDString, publicToken: string) {
  await service.get(`/business-bank-accounts/link-token/${publicToken}/accounts`, getHeaders(bid));
  return (await service.get<readonly Readonly<LinkedBankAccounts>[]>('/business-bank-accounts', getHeaders(bid))).data;
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
    getHeaders(bid),
  );
}
