import type { Setter, SetterFunc } from '_common/types/common';
import type { PageRequest } from 'generated/capital';

interface Generic {
  pageRequest?: PageRequest;
}

export function extendPageSize<T extends Readonly<Generic>>(params: T, pageSize: number): T {
  return { ...params, pageRequest: { ...params.pageRequest, pageSize } };
}

export function onPageSizeChange<T extends Readonly<Generic>>(
  setter: Setter<T>,
  callback: (pageSize: number) => void,
): Setter<T> {
  return (updates: T | SetterFunc<T>): void => {
    setter((prev) => {
      const next = typeof updates === 'function' ? updates(prev) : updates;

      const pageSize = next.pageRequest?.pageSize;
      if (pageSize !== undefined && prev.pageRequest?.pageSize !== pageSize) callback(pageSize);

      return next;
    });
  };
}
