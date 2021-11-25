import type { JSXElement } from 'solid-js';
import { Switch, Match } from 'solid-js/web';

import { Loading } from '../Loading';
import { LoadingError } from '../LoadingError';

interface DataProps<T = unknown> {
  error: unknown;
  loading: boolean;
  data: T | null;
  children: JSXElement;
  onReload: () => Promise<unknown>;
}

export function Data<T = unknown>(props: Readonly<DataProps<T>>) {
  return (
    <Switch>
      <Match when={props.error}>
        <LoadingError onReload={props.onReload} />
      </Match>
      <Match when={props.loading && !props.data}>
        <Loading />
      </Match>
      <Match when={props.data}>{props.children}</Match>
    </Switch>
  );
}
