import { createEffect, on } from 'solid-js';
import type { Accessor, AccessorArray } from 'solid-js/types/reactive/signal';

export function useDeferEffect<D extends unknown>(
  fn: (current: D, prev: D | undefined) => void,
  deps: AccessorArray<D> | Accessor<D>,
) {
  createEffect(on(deps, (current, prev) => fn(current, prev), { defer: true }));
}
