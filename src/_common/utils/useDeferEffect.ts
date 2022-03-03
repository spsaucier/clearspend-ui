import { createEffect, on, type Accessor, type ReturnTypes } from 'solid-js';

export function useDeferEffect<D extends Accessor<unknown> | Accessor<unknown>[]>(
  fn: (current: ReturnTypes<D>, prev: ReturnTypes<D>) => void,
  deps: D,
) {
  createEffect(
    on(
      deps,
      (current, prev) => {
        fn(current, prev);
        return current;
      },
      { defer: true },
    ),
  );
}
