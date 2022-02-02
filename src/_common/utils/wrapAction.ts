import { createSignal } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapAction<T, P extends any[], A extends ((...args: P) => Promise<T>) | undefined>(action: A) {
  const [loading, setLoading] = createSignal(false);

  const handler =
    action &&
    (((...args: P): Promise<T> => {
      setLoading(true);

      return action(...args)
        .then((data: T) => {
          setLoading(false);
          return data;
        })
        .catch((error: unknown) => {
          setLoading(false);
          throw error;
        });
    }) as A);

  return [loading, handler] as const;
}
