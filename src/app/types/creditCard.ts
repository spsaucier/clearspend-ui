export interface CodatCreditCard {
  id: string;
  accountName: string;
}

export interface CodatBankAccountResponse {
  results: CodatCreditCard[];
}
