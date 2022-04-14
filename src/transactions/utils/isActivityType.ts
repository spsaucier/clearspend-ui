import type { LedgerActivityResponse, AccountActivityResponse } from 'generated/capital';

export function isActivityType(
  data: LedgerActivityResponse | AccountActivityResponse,
): data is AccountActivityResponse {
  return 'accountName' in data;
}
