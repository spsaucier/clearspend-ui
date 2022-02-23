import type {
  CodatBankAccountResponse,
  CodatCreateCreditCardRequest,
  CodatCreateCreditCardResponse,
} from 'app/types/creditCard';
import { service } from 'app/utils/service';
import type { ExpenseCategory } from 'generated/capital';

import type { IntegrationAccountResponse } from './components/ChartOfAccountsData/types';
import { TEMP_QBO_EXPENSE_CATEGORIES } from './constants';
import type { UpdateBusinessAccountingStepRequest } from './types';

export async function getCompanyConnection(): Promise<boolean> {
  return (await service.get<Readonly<boolean>>(`/codat/connection-status`)).data;
}

export async function syncTransaction(transactionId: string) {
  return (await service.post<Readonly<boolean>>(`/codat/sync/${transactionId}`)).data;
}

export async function getCodatCreditCards() {
  return (await service.get<Readonly<CodatBankAccountResponse>>(`/codat/bank-accounts`)).data;
}

export async function postCodatCreditCard(params: Readonly<CodatCreateCreditCardRequest>) {
  return (await service.post<Readonly<CodatCreateCreditCardResponse>>(`/codat/bank-accounts`, params)).data;
}

export async function postAccountingStepToBusiness(params: Readonly<UpdateBusinessAccountingStepRequest>) {
  return (await service.post<Readonly<UpdateBusinessAccountingStepRequest>>(`/businesses/accounting-step`, params))
    .data;
}

export async function getExpenseCategories() {
  return (await service.get<readonly Readonly<ExpenseCategory>[]>('/expense-categories/list')).data;
}

export async function getIntegrationExpenseCategories(): Promise<IntegrationAccountResponse[]> {
  return TEMP_QBO_EXPENSE_CATEGORIES; // TODO: delete temp data and replace with the below
}

// export async function getIntegrationExpenseCategories() {
//   return (await service.get<Readonly<INSERT_TYPE>[]>(`/codat/get-accounts`)).data;
// }
