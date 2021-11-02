import { service } from 'app/utils/service';

import type { LinkToken, LinkedBankAccounts } from '../types';

export async function getLinkToken() {
  return (await service.get<LinkToken>('/business-bank-accounts/link-token')).data.linkToken;
}

export async function linkBankAccounts(publicToken: string) {
  return (
    await service.get<readonly Readonly<LinkedBankAccounts>[]>(
      `/business-bank-accounts/link-token/${publicToken}/accounts`,
    )
  ).data;
}

export async function getBankAccounts() {
  return (await service.get<readonly Readonly<LinkedBankAccounts>[]>('/business-bank-accounts')).data;
}

export async function deposit(accountId: string, amount: number) {
  return service.post(`/business-bank-accounts/${accountId}/transactions`, {
    bankAccountTransactType: 'DEPOSIT',
    amount: {
      currency: 'USD',
      amount: amount,
    },
    isOnboarding: true,
  });
}
