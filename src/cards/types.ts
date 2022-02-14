import type { SearchCardRequest, IssueCardRequest } from 'generated/capital';

export enum CardType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export type CardFiltersFields = keyof Omit<SearchCardRequest, 'pageRequest' | 'searchText'>;

export type PaymentType = ValuesOf<IssueCardRequest['disabledPaymentTypes']>;
