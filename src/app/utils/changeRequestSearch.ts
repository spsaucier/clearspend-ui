import type { Setter } from 'solid-js';

import type { StoreSetter } from '_common/utils/store';

interface Generic {
  searchText?: string;
}

export function changeRequestSearch<T extends Readonly<Generic>>(setter: Setter<T> | StoreSetter<T>) {
  return (searchText: string): void => {
    (setter as (func: (state: T) => T) => void)((prev) => ({ ...prev, searchText }));
  };
}
