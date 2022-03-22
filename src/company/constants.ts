import type { AccountActivityRequest } from 'generated/capital';

export const LEDGER_PAGE_SIZE_STORAGE_KEY = 'ledger_page_size';

export const DEFAULT_LEDGER_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
  types: [
    'BANK_DEPOSIT',
    'BANK_DEPOSIT_RETURN',
    'BANK_LINK',
    'BANK_UNLINK',
    'BANK_WITHDRAWAL',
    'BANK_WITHDRAWAL_RETURN',
    'MANUAL',
    'REALLOCATE',
    'FEE',
  ],
};
