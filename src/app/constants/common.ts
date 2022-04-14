import type { PageRequest } from 'generated/capital';

export const USERS_START_COUNT = 1;
export const ALLOCATIONS_START_COUNT = 1;

export const DEFAULT_PAGE_REQUEST: Readonly<PageRequest> = {
  pageNumber: 0,
  pageSize: 10,
};
