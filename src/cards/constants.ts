import { DEFAULT_PAGE_REQUEST } from 'app/constants/common';
import type { SearchCardRequest } from 'generated/capital';

export const CARDS_PAGE_SIZE_STORAGE_KEY = 'cards_page_size';

export const DEFAULT_CARD_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    ...DEFAULT_PAGE_REQUEST,
    orderBy: [
      {
        item: 'activationDate',
        direction: 'ASC',
      },
    ],
  },
};
