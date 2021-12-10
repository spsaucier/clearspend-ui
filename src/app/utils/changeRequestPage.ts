import type { Setter } from 'solid-js';

import type { PageRequest } from 'generated/capital';
import type { StoreSetter } from '_common/utils/store';

export interface Generic {
  pageRequest?: Readonly<PageRequest>;
}

export function changeRequestPage<T extends Readonly<Generic>>(setter: Setter<T> | StoreSetter<T>) {
  return (page: number): void => {
    (setter as (func: (state: T) => T) => void)((prev) => ({
      ...prev,
      pageRequest: { ...prev.pageRequest, pageNumber: page },
    }));
  };
}
