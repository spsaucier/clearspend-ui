import type { LedgerActivityRequest } from 'generated/capital';

export type LedgerFiltersFields = keyof Omit<LedgerActivityRequest, 'pageRequest' | 'searchText'>;

export interface FormValues {
  amountMin: string;
  amountMax: string;
  date: ReadonlyDate[];
  types: string[];
}

export type FormResult = Pick<LedgerActivityRequest, 'amount' | 'from' | 'to' | 'types'>;
