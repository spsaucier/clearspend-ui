import { createSignal } from 'solid-js';

export function wrapAction<T, P extends unknown[]>(action: (...args: P) => Promise<T>) {
  const [state, setState] = createSignal(false);

  const handler = (...args: P): Promise<T> => {
    setState(true);

    return action(...args)
      .then((data: T) => {
        setState(false);
        return data;
      })
      .catch(() => setState(false)) as Promise<T>;
  };

  return [state, handler] as const;
}
