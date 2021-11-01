import type { UUIDString } from 'app/types/common';

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
