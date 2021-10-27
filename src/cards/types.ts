import type { UUIDString } from 'app/types';

export enum CardType {
  PLASTIC = 'PLASTIC',
  VIRTUAL = 'VIRTUAL',
}

export interface IssueCard {
  bin: string;
  programId: UUIDString;
  allocationId: UUIDString;
  userId: UUIDString;
  currency: 'USD';
  cardType: CardType;
}
