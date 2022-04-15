import type { Setter, SetterFunc } from '_common/types/common';
import { isFunction } from '_common/utils/isFunction';

interface Generic {
  allocationId?: string;
}

export function onAllocationChange<T extends Readonly<Generic>>(
  setter: Setter<T>,
  callback: (id: string | undefined) => void,
): Setter<T> {
  return (updates: T | SetterFunc<T>): void => {
    setter((prev) => {
      const next = isFunction(updates) ? updates(prev) : updates;
      if (prev.allocationId !== next.allocationId) callback(next.allocationId);
      return next;
    });
  };
}
