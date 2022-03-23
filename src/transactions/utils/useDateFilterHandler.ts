import { createSignal } from 'solid-js';

import type { Setter, SetterFunc } from '_common/types/common';
import type { DateRange } from 'app/types/common';

export function useDateFilterHandler<T extends Readonly<Partial<DateRange>>>(
  setter: Setter<T>,
  defRange: Readonly<DateRange> | undefined,
) {
  const [date, setDate] = createSignal<Partial<DateRange>>({
    from: undefined,
    to: undefined,
  });

  const handler = (updates: T | SetterFunc<T>): void => {
    setter((prev) => {
      let next = typeof updates === 'function' ? updates(prev) : updates;

      setDate({ from: next.from, to: next.to });
      if (defRange && (!next.from || !next.to)) next = { ...next, ...defRange };

      return next;
    });
  };

  return [date, handler] as const;
}
