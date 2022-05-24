/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

import { onCleanup, batch, type Accessor } from 'solid-js';
import { createStore } from 'solid-js/store';

import { AppEvent } from 'app/types/common';
import { AnalyticsEventType, sendAnalyticsEvent } from 'app/utils/analytics';

import { events } from '../api/events';
import type { Setter } from '../types/common';

import { getNoop } from './getNoop';
import { useDeferEffect } from './useDeferEffect';
import { isFunction } from './isFunction';

export type StoreSetterArg<T> = Parameters<Setter<T>>[0];
export type SuccessCallback<T> = (data: T) => void;

export interface Store<T, P> {
  loading: boolean;
  error: unknown;
  data: T | null;
  params: P;
  reload: () => Promise<unknown>;
  setData: Setter<T>;
  setParams: Setter<P>;
}

export interface Options<T, P> {
  params?: P;
  initValue?: T;
  skip?: boolean;
  deps?: Accessor<Partial<P>>;
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
    setData: (arg: StoreSetterArg<T>) => {
      setStore((prev) => ({ ...prev, data: (isFunction(arg) ? arg(prev.data as T) : arg) as any }));
    },
    setParams: (arg: StoreSetterArg<P>) => {
      setStore((prev) => ({
        ...prev,
        params: (isFunction(arg) ? arg(prev.params as P) : arg) as any,
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
    if (!options?.skip) store.reload().catch(getNoop());

    if (options?.deps) {
      useDeferEffect((params) => {
        setStore((prev) => ({ ...prev, params: { ...prev.params, ...params } }));
        // NOTE: Starting from SolidJS 1.4, there is a 'gap' between setStore and applying the changes, inside effects.
        setTimeout(() => store.reload().catch(getNoop()), 0);
      }, options.deps);
    }

    onCleanup(() => {
      init();
      if (options?.onSuccess) {
        callbacks.delete(options.onSuccess);
      }
    });

    return store as Store<T, P>;
  }

  events.sub(AppEvent.Logout, () => {
    sendAnalyticsEvent({ type: AnalyticsEventType.Logout });
    setStore((prev) => ({ ...prev, data: null }));
  });

  return useStore;
}
