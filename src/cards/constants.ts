import type { SearchCardRequest } from 'generated/capital';

export const CARDS_PAGE_SIZE_STORAGE_KEY = 'cards_page_size';

export const DEFAULT_CARD_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
    orderBy: [
      {
        item: 'activationDate',
        direction: 'DESC',
      },
    ],
  },
};
