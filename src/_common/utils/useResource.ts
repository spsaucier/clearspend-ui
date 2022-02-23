import { createSignal, createEffect, onMount, createMemo, on } from 'solid-js';

import { cloneObject } from './cloneObject';
import { getNoop } from './getNoop';

export interface DataState<T> {
  loading: boolean;
  error: Error | null;
  data: T;
}

export function useResource<T, P extends unknown>(
  fetcher: (params: P) => Promise<T>,
  initParams?: P,
  fetchOnMount: boolean = true,
) {
  let skipUpdates = false;
  const [params, setParams] = createSignal<P>(cloneObject(initParams as P));

  const [state, setState] = createSignal<DataState<T | null>>({
    loading: fetchOnMount,
    error: null,
    data: null,
  });

  const reload = () => {
    setState((prev) => ({ ...prev, loading: true }));

    return fetcher(params())
      .then((data: T) => {
        setState({ loading: false, error: null, data });
      })
      .catch((error: Error) => {
        setState({ loading: false, error, data: null });
      });
  };

  const mutate = (data: T | null, reset?: boolean) => {
    setState((prev) => ({ ...prev, data: data }));

    if (reset) {
      skipUpdates = true;
      setParams(() => cloneObject(initParams as P));
      skipUpdates = false;
    }
  };

  onMount(() => {
    if (!fetchOnMount) return;
    reload().catch(getNoop());
  });

  createEffect(
    on(
      params,
      (input) => {
        if (!skipUpdates) reload().catch(getNoop());
        return input;
      },
      { defer: true },
    ),
  );

  const data = createMemo(() => state().data);

  const status = createMemo<Omit<DataState<T>, 'data'>>(() => ({
    loading: state().loading,
    error: state().error,
  }));

  return [data, status, params, setParams, reload, mutate] as const;
}
