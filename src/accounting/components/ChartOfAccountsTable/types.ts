import type { AddChartOfAccountsMappingRequest } from 'generated/capital';

export type IntegrationAccountMap = Record<string, Readonly<AddChartOfAccountsMappingRequest> | null>;

export enum NestedLevels {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}
