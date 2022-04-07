import type { CardFiltersFields } from 'cards/types';
import type { SearchCardRequest } from 'generated/capital';
import type { Setter } from '_common/types/common';
import type { AmountRange } from 'app/utils/filters';

export type FormResult = Omit<SearchCardRequest, 'pageRequest' | 'searchText'>;

export interface FormValues extends Omit<Required<FormResult>, 'balance'>, AmountRange {}

export interface CardsFilterDrawerProps {
  params: SearchCardRequest;
  omitFilters?: readonly CardFiltersFields[];
  onReset: () => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>>;
}
