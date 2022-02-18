import type { CodatBankAccountResponse } from 'app/types/creditCard';
import { service } from 'app/utils/service';

export async function getCompanyConnection(): Promise<boolean> {
  return (await service.get<Readonly<boolean>>(`/codat/connection-status`)).data;
}

export async function syncTransaction(transactionId: string) {
  return (await service.get<Readonly<boolean>>(`/codat/sync/${transactionId}`)).data;
}

export async function getCodatCreditCards() {
  return (await service.get<Readonly<CodatBankAccountResponse>>(`/codat/bank-accounts`)).data;
}
