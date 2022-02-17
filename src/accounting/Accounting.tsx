import { createSignal, Match, onMount, Show, Switch } from 'solid-js';
import { Navigate } from 'solid-app-router';

import { useBusiness } from 'app/containers/Main/context';
import { Loading } from 'app/components/Loading';

import { canSeeAccounting } from './utils/canSeeAccounting';
import { AccountingTabs } from './pages/AccountingTabs';
import { Integrations } from './pages/Integrations';
import { getCompanyConnection } from './services';
import { AddCreditCardForm } from './pages/AddCreditCardForm';

export function Accounting() {
  const { signupUser, business } = useBusiness();
  const [hasIntegrationConnection, setHasIntegrationConnection] = createSignal<boolean | null>(null);

  onMount(async () => {
    const res = await getCompanyConnection();
    setHasIntegrationConnection(res);
  });

  return (
    <Show when={canSeeAccounting(signupUser())} fallback={<Navigate href="/" />}>
      <Switch>
        <Match when={hasIntegrationConnection() == null}>
          <Loading />
        </Match>
        <Match when={hasIntegrationConnection() === false}>
          <Integrations />
        </Match>
        <Match when={hasIntegrationConnection() === true}>
          <Switch>
            <Match when={business().accountingSetupStep !== 'COMPLETE'}>
              <AddCreditCardForm />
            </Match>
            <Match when={business().accountingSetupStep === 'COMPLETE'}>
              <AccountingTabs />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </Show>
  );
}
