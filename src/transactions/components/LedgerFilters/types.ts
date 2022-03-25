import type { LedgerActivityRequest } from 'generated/capital';

import type { LedgerActivityType } from '../../types';
import type { AmountRange } from '../../utils/filters';

export type LedgerFiltersFields = keyof Omit<LedgerActivityRequest, 'pageRequest' | 'searchText'>;

export interface FormValues extends AmountRange {
  date: ReadonlyDate[];
  types: LedgerActivityType[];
}

export type FormResult = Pick<LedgerActivityRequest, 'amount' | 'from' | 'to' | 'types'>;
