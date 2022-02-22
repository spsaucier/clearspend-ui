import { createSignal, Match, onMount, Show, Switch } from 'solid-js';
import { Navigate } from 'solid-app-router';

import { Loading } from 'app/components/Loading';
import { AccountSetupStep } from 'app/types/businesses';

import { useBusiness } from '../app/containers/Main/context';

import { canSeeAccounting } from './utils/canSeeAccounting';
import { AccountingTabs } from './pages/AccountingTabs';
import { Integrations } from './pages/Integrations';
import { getCompanyConnection, postAccountingStepToBusiness } from './services';
import { AddCreditCardForm } from './pages/AddCreditCardForm';
import { ChartOfAccounts } from './pages/ChartOfAccounts';

export default function Accounting() {
  const { signupUser, business } = useBusiness();
  const [hasIntegrationConnection, setHasIntegrationConnection] = createSignal<boolean | null>(null);
  const [step, setStep] = createSignal<AccountSetupStep | undefined>(
    business().accountingSetupStep as AccountSetupStep,
  );

  onMount(async () => {
    const res = await getCompanyConnection();
    setHasIntegrationConnection(res);
  });

  const onUpdateCreditCard = async () => {
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.MAP_CATEGORIES });
    setStep(AccountSetupStep.MAP_CATEGORIES);
  };

  const onCompleteChartOfAccounts = async () => {
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.COMPLETE });
    setStep(AccountSetupStep.COMPLETE);
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
          <Switch>
            <Match when={step() === AccountSetupStep.ADD_CREDIT_CARD}>
              <AddCreditCardForm onNext={onUpdateCreditCard} />
            </Match>
            <Match when={step() === AccountSetupStep.MAP_CATEGORIES}>
              <ChartOfAccounts onNext={onCompleteChartOfAccounts} />
            </Match>
            <Match when={step() === AccountSetupStep.COMPLETE}>
              <AccountingTabs />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </Show>
  );
}
