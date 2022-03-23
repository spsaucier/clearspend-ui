import { service } from 'app/utils/service';
import type {
  BankAccount,
  LinkTokenResponse,
  TransactBankAccountRequest,
  CreateAdjustmentResponse,
} from 'generated/capital';

export async function getLinkToken() {
  return (await service.get<LinkTokenResponse>('/business-bank-accounts/link-token')).data.linkToken;
}

export async function linkBankAccounts(publicToken: string) {
  return (
    await service.get<readonly Readonly<Required<BankAccount>>[]>(
      `/business-bank-accounts/link-token/${publicToken}/accounts`,
    )
  ).data;
}

export async function registerBankAccount(accountId: string) {
  return (
    await service.post<readonly Readonly<Required<BankAccount>>[]>(`/business-bank-accounts/${accountId}/register`)
  ).data;
}

export function unregisterBankAccount(businessBankAccountId: string) {
  return service.post(`/business-bank-accounts/${businessBankAccountId}/unregister`);
}

export async function getBankAccounts() {
  return (await service.get<readonly Readonly<Required<BankAccount>>[]>('/business-bank-accounts')).data;
}

export async function bankTransaction(
  type: Required<TransactBankAccountRequest>['bankAccountTransactType'],
  accountId: string,
  amount: number,
) {
  return service.post<Required<CreateAdjustmentResponse>>(`/business-bank-accounts/${accountId}/transactions`, {
    bankAccountTransactType: type,
    amount: {
      currency: 'USD',
      amount: amount,
    },
  });
}
