import { createSignal } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapAction<T, P extends any[], A extends ((...args: P) => Promise<T>) | undefined>(action: A) {
  const [state, setState] = createSignal(false);

  const handler =
    action &&
    (((...args: P): Promise<T> => {
      setState(true);

      return action(...args)
        .then((data: T) => {
          setState(false);
          return data;
        })
        .catch((error: unknown) => {
          setState(false);
          throw error;
        });
    }) as A);

  return [state, handler] as const;
}
