import { createSignal, batch, Switch, Match, type JSXElement } from 'solid-js';

import { loadPolyfills } from '_common/api/intl/polyfills';
import { Fault } from '_common/components/Fault';
import { getNoop } from '_common/utils/getNoop';

import { Loading } from '../../components/Loading';

interface IntlPolyfillsProps {
  children?: JSXElement;
}

export function IntlPolyfills(props: Readonly<IntlPolyfillsProps>) {
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);

  const load = async () => {
    setLoading(true);

    await loadPolyfills()
      .then(() => {
        batch(() => {
          setError(false);
          setLoading(false);
        });
      })
      .catch(() => {
        setError(true);
      });
  };

  load().catch(getNoop(true));

  return (
    <Switch>
      <Match when={error()}>
        <Fault onReload={load} />
      </Match>
      <Match when={loading()}>
        <Loading />
      </Match>
      <Match when={!error() && !loading()}>{props.children}</Match>
    </Switch>
  );
}
