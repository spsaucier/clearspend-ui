import { createSignal, Match, onMount, Show, Switch } from 'solid-js';
import { Navigate } from 'solid-app-router';

import { Loading } from 'app/components/Loading';
import { useBusiness } from 'app/containers/Main/context';
import { canManageConnections } from 'allocations/utils/permissions';

import { AccountingTabs } from './pages/AccountingTabs';
import { Integrations } from './pages/Integrations';
import { getCompanyConnection } from './services';

export default function Accounting() {
  const { permissions } = useBusiness();
  const [hasIntegrationConnection, setHasIntegrationConnection] = createSignal<boolean | null>(null);

  onMount(async () => {
    getCompanyConnectionState();
  });

  const getCompanyConnectionState = async () => {
    const res = await getCompanyConnection();
    setHasIntegrationConnection(res);
  };

  return (
    <Show when={canManageConnections(permissions())} fallback={<Navigate href="/" />}>
      <Switch>
        <Match when={hasIntegrationConnection() == null}>
          <Loading />
        </Match>
        <Match when={hasIntegrationConnection() === false}>
          <Integrations />
        </Match>
        <Match when={hasIntegrationConnection() === true}>
          <AccountingTabs />
        </Match>
      </Switch>
    </Show>
  );
}
