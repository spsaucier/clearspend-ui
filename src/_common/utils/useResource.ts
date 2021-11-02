import { createSignal, createEffect, createMemo } from 'solid-js';

import { cloneObject } from './cloneObject';
import { getNoop } from './getNoop';

export interface DataState<T> {
  loading: boolean;
  error: unknown;
  data: T;
}

export function useResource<T, P extends unknown>(
  fetcher: (params: P) => Promise<T>,
  initParams: P,
  fetchOnMount: boolean = true,
) {
  const [params, setParams] = createSignal<P>(cloneObject(initParams));

  const [state, setState] = createSignal<DataState<T>>({
    loading: true,
    error: null,
    data: null as unknown as T,
  });

  const reload = () => {
    setState((prev) => ({ ...prev, loading: true }));

    return fetcher(params())
      .then((data: T) => {
        setState({ loading: false, error: null, data });
      })
      .catch((error: unknown) => {
        setState({ loading: false, error, data: null as unknown as T });
      });
  };

  const mutate = (data: T | null) => {
    setState((prev) => ({ ...prev, data: data as T }));
  };

  createEffect(() => {
    if (fetchOnMount) reload().catch(getNoop());
  });

  const data = createMemo(() => state().data);

  const status = createMemo<Omit<DataState<T>, 'data'>>(() => ({
    loading: state().loading,
    error: state().error,
  }));

  return [data, status, params, setParams, reload, mutate] as const;
}
