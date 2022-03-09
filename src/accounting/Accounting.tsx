import { createSignal, Match, onMount, Show, Switch } from 'solid-js';
import { Navigate, useNavigate } from 'solid-app-router';

import { Loading } from 'app/components/Loading';
import { AccountSetupStep } from 'app/types/businesses';

import { useBusiness } from '../app/containers/Main/context';

import { canSeeAccounting } from './utils/canSeeAccounting';
import { AccountingTabs } from './pages/AccountingTabs';
import { Integrations } from './pages/Integrations';
import { getCompanyConnection } from './services';

export default function Accounting() {
  const { signupUser, business } = useBusiness();
  const [hasIntegrationConnection, setHasIntegrationConnection] = createSignal<boolean | null>(null);
  const step = business().accountingSetupStep as AccountSetupStep;

  const navigate = useNavigate();

  onMount(async () => {
    getCompanyConnectionState();
    if (step !== AccountSetupStep.COMPLETE) {
      navigate('/accounting-setup');
    }
  });

  const getCompanyConnectionState = async () => {
    const res = await getCompanyConnection();
    setHasIntegrationConnection(res);
  };

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
          <AccountingTabs />
        </Match>
      </Switch>
    </Show>
  );
}
