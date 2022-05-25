import { createSignal } from 'solid-js';

export function useBool(init = false) {
  const [state, setState] = createSignal(init);
  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}
