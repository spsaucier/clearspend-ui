export interface IntegrationAccountMapping {
  accountRef: string;
  expenseCategoryId?: string;
  expenseCategoryName?: string;
  fullyQualifiedCategory?: string;
}

export type IntegrationAccountMap = Record<string, Readonly<IntegrationAccountMapping> | null>;

export enum NestedLevels {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}
