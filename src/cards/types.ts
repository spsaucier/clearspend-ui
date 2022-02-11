import type { SearchCardRequest } from 'generated/capital';

export enum CardType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export type CardFiltersFields = keyof Omit<SearchCardRequest, 'pageRequest' | 'searchText'>;

export enum MccGroup {
  CHILD_CARE = 'CHILD_CARE',
  DIGITAL_GOODS = 'DIGITAL_GOODS',
  EDUCATION = 'EDUCATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  GAMBLING = 'GAMBLING',
  GOVERNMENT = 'GOVERNMENT',
  HEALTH = 'HEALTH',
  MEMBERSHIPS = 'MEMBERSHIPS',
  MONEY_TRANSFER = 'MONEY_TRANSFER',
  SERVICES = 'SERVICES',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  UTILITIES = 'UTILITIES',
  OTHER = 'OTHER',
}
