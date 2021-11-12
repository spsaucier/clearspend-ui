import type { Setter } from 'solid-js';

import type { PageRequest } from '../types/common';

interface Generic {
  pageRequest: Readonly<PageRequest>;
}

export function changeRequestPage<T extends Readonly<Generic>>(setter: Setter<T>) {
  return (page: number): void => {
    (setter as (func: (state: T) => T) => void)((prev) => ({
      ...prev,
      pageRequest: { ...prev.pageRequest, pageNumber: page },
    }));
  };
}
