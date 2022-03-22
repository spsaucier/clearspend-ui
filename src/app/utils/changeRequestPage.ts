import type { PageRequest } from 'generated/capital';
import type { Setter } from '_common/types/common';

interface Generic {
  pageRequest?: Readonly<PageRequest>;
}

export function changeRequestPage<T extends Readonly<Generic>>(setter: Setter<T>) {
  return (pageNumber: number, pageSize: number): void => {
    setter((prev) => ({ ...prev, pageRequest: { ...prev.pageRequest, pageNumber, pageSize } }));
  };
}
