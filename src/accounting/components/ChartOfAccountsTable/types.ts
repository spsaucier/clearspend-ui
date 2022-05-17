import type { CodatAccountNested, AddChartOfAccountsMappingRequest } from 'generated/capital';

export interface FlattenedIntegrationAccount extends Omit<CodatAccountNested, 'children'> {
  parentId: string | undefined;
  level: number;
  isNew: boolean;
}

export type ChartOfAccountsMap = Record<string, AddChartOfAccountsMappingRequest | undefined>;
