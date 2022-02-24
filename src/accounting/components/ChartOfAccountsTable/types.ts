export interface IntegrationAccountMapping {
  accountRef: string;
  categoryIconRef: number;
}

export interface IntegrationAccountMap {
  [key: string]: IntegrationAccountMapping | null;
}
