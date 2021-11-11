import type { UUIDString, Address } from 'app/types/common';

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
