import type { UUIDString, Amount, Address, PageRequest, PageResponse } from 'app/types/common';
import type { BaseUser } from 'employees/types';

export enum CardType {
  PLASTIC = 'PLASTIC',
  VIRTUAL = 'VIRTUAL',
}

export interface IssueCard {
  programId: UUIDString;
  allocationId: UUIDString;
  userId: UUIDString;
  currency: 'USD';
  cardType: readonly CardType[];
  isPersonal: boolean;
}

export enum CardStatus {
  OPEN = 'OPEN',
  BLOCKED = 'BLOCKED',
  RETIRED = 'RETIRED',
}

export enum FundingType {
  POOLED = 'POOLED',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface Card {
  cardId: UUIDString;
  bin: string;
  programId: UUIDString;
  allocationId: UUIDString;
  userId: UUIDString;
  accountId: UUIDString;
  status: CardStatus;
  statusReason: 'NONE';
  fundingType: FundingType;
  issueDate: DateString;
  expirationDate: DateString;
  activated: boolean;
  activationDate: DateString | null;
  cardLine3: string;
  cardLine4: string;
  type: CardType;
  superseded: boolean;
  cardNumber: string;
  lastFour: string;
  address: Readonly<Address>;
}

export interface SearchCardRequest {
  pageRequest: Readonly<PageRequest>;
  userId?: UUIDString;
  allocationId?: UUIDString;
  searchText?: string;
}

export interface SearchCardAllocation {
  id: UUIDString;
  name: string;
}

export interface SearchCard {
  cardId: UUIDString;
  cardNumber: string;
  user: Readonly<BaseUser>;
  allocation: Readonly<SearchCardAllocation>;
  balance: Readonly<Amount>;
  cardStatus: CardStatus;
}

export type SearchCardResponse = Readonly<PageResponse<readonly Readonly<SearchCard>[]>>;
