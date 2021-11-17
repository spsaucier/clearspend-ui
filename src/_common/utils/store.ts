/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

import { onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getNoop } from '_common/utils/getNoop';

export type StoreSetterParams<P> = P | ((params: P) => P);
export type StoreSetter<P> = (setter: StoreSetterParams<P>) => void;

export interface Store<T, P> {
  loading: boolean;
  error: unknown;
  data: T | null;
  params: P;
  reload: () => Promise<unknown>;
  setParams: StoreSetter<P>;
}

export function create<T, P>(fetcher: (params: P) => Promise<T>) {
  const [store, setStore] = createStore<Store<T, P>>({
    loading: true,
    error: null,
    data: null,
    params: null as unknown as P,
    reload: (): Promise<unknown> => {
      setStore((prev) => ({ ...prev, loading: true }));

      return fetcher(store.params)
        .then((data: T) => {
          setStore((prev) => ({ ...prev, loading: false, error: null, data: data as unknown as null }));
        })
        .catch((error: unknown) => {
          setStore((prev) => ({ ...prev, loading: false, error, data: null }));
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

  function useStore(params: P) {
    setStore((prev) => ({ ...prev, params: params as any }));
    store.reload().catch(getNoop());

    onCleanup(() => setStore((prev) => ({ ...prev, params: params as any })));

    return store;
  }

  return useStore;
}
