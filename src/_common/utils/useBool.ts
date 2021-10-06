import { createSignal } from 'solid-js';

export function useBool() {
  const [state, setState] = createSignal(false);
  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}
