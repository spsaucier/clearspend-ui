export interface IntegrationAccountMapping {
  accountRef: string;
  categoryIconRef: number;
}

export interface IntegrationAccountMap {
  [key: string]: IntegrationAccountMapping | null;
}

export enum NestedLevels {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
}
