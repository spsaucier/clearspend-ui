export interface CodatCreditCard {
  id: string;
  accountName: string;
}

export interface CodatBankAccountResponse {
  results: CodatCreditCard[];
}

export interface CodatCreateCreditCardRequest {
  accountName: string;
}

export interface CodatSetCreditCardRequest {
  accountId: string;
}

export interface CodatCreateCreditCardResponse {
  validation: CodatError[];
  pushOperationKey: string;
  status: string;
}

export interface CodatError {
  itemId: string;
  message: string;
}
