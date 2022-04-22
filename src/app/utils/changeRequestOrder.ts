import type { PageRequest } from 'generated/capital';
import type { Setter } from '_common/types/common';
import type { OrderBy } from '_common/components/Table';

interface Generic {
  pageRequest?: Readonly<PageRequest>;
}

export function changeRequestOrder<T extends Readonly<Generic>>(setter: Setter<T>) {
  return (orderBy: Readonly<OrderBy>[] | undefined): void => {
    setter((prev) => ({ ...prev, pageRequest: prev.pageRequest && { ...prev.pageRequest, pageNumber: 0, orderBy } }));
  };
}
