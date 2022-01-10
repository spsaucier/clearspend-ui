/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

import { onCleanup, batch } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getNoop } from '_common/utils/getNoop';

export type StoreSetterParams<P> = P | ((params: P) => P);
export type StoreSetter<P> = (setter: StoreSetterParams<P>) => void;

export type SuccessCallback<T> = (data: T) => void;

export interface Store<T, P> {
  loading: boolean;
  error: unknown;
  data: T | null;
  params: P;
  reload: () => Promise<unknown>;
  setParams: StoreSetter<P>;
}

export interface Options<T, P> {
  params?: P;
  initValue?: T;
  onSuccess?: SuccessCallback<T>;
}

export function create<T, P>(fetcher: (params: P) => Promise<T>) {
  const callbacks = new Set<SuccessCallback<T>>();

  const [store, setStore] = createStore<Store<T, P>>({
    loading: true,
    error: null,
    data: null,
    params: null as unknown as P,
    reload: (): Promise<unknown> => {
      setStore((prev) => ({ ...prev, loading: true }));

      return fetcher(store.params as P)
        .then((data: T) => {
          batch(() => {
            setStore((prev) => ({ ...prev, loading: false, error: null, data: data } as unknown as P));
            if (callbacks.size) callbacks.forEach((cb) => cb(data));
          });
        })
        .catch((error: unknown) => {
          setStore((prev) => ({ ...prev, loading: false, error, data: null } as unknown as P));
        });
    },
    setParams: (arg: StoreSetterParams<P>) => {
      setStore((prev) => ({
        ...prev,
        params: typeof arg === 'function' ? (arg as Function)(prev.params) : arg,
      }));
      store.reload().catch(getNoop());
    },
  });

  function useStore(options?: Readonly<Options<T, P>>) {
    if (options?.onSuccess) {
      callbacks.add(options.onSuccess);
    }

    const init = () => {
      setStore((prev) => ({
        ...prev,
        params: (options?.params as any) || null,
        ...(!(prev.data as unknown) && { data: (options?.initValue as any) || null }),
      }));
    };

    init();
    store.reload().catch(getNoop());

    onCleanup(() => {
      init();
      if (options?.onSuccess) {
        callbacks.delete(options.onSuccess);
      }
    });

    return store as Store<T, P>;
  }

  return useStore;
}
