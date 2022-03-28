import type { CardFiltersFields } from 'cards/types';
import type { SearchCardRequest } from 'generated/capital';
import type { Setter } from '_common/types/common';

export type FormResult = Omit<SearchCardRequest, 'pageRequest'>;

export interface FormValues extends FormResult {
  amountMin: string;
  amountMax: string;
}

export interface CardsFilterDrawerProps {
  params: SearchCardRequest;
  omitFilters?: readonly CardFiltersFields[];
  onReset: () => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>>;
}
