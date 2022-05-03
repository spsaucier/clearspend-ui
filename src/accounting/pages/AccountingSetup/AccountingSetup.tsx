import { createSignal, Match, onCleanup, onMount, Switch } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import {
  deleteIntegrationConnection,
  deleteIntegrationExpenseCategoryMappings,
  getCompanyConnection,
  postAccountingStepToBusiness,
} from 'accounting/services';
import { useBusiness } from 'app/containers/Main/context';
import { AccountSetupStep } from 'app/types/businesses';
import { Button } from '_common/components/Button';

import { AddCreditCardForm } from '../AddCreditCardForm';
import { ChartOfAccounts } from '../ChartOfAccounts';
import { AwaitingCodatSync } from '../AwaitingCodatSync/AwaitingCodatSync';

const REFETCH_MS_CHECK_ACCOUNTING_STEP = 3000; // 3 seconds

export default function AccountingSetup() {
  const { business, mutate, refetch } = useBusiness();

  const [totalWaitTime, setTotalWaitTime] = createSignal<number>(0);

  onMount(() => {
    const refetchInterval = setInterval(() => {
      setTotalWaitTime(totalWaitTime() + REFETCH_MS_CHECK_ACCOUNTING_STEP);
      if (business().accountingSetupStep === AccountSetupStep.AWAITING_SYNC) {
        refetch();
      }
    }, REFETCH_MS_CHECK_ACCOUNTING_STEP);
    onCleanup(() => {
      clearInterval(refetchInterval);
    });
  });

  const [hasIntegrationConnection, setHasIntegrationConnection] = createSignal<boolean | null>(null);

  const navigate = useNavigate();

  const onUpdateCreditCard = async () => {
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.MAP_CATEGORIES });
    mutate({ business: { ...business(), accountingSetupStep: AccountSetupStep.MAP_CATEGORIES } });
  };

  const getCompanyConnectionState = async () => {
    const res = await getCompanyConnection();
    setHasIntegrationConnection(res);
  };

  onMount(async () => {
    getCompanyConnectionState();
    if (business().accountingSetupStep === AccountSetupStep.COMPLETE) {
      navigate('/accounting');
    }
  });

  const onCompleteChartOfAccounts = async () => {
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.COMPLETE });
    mutate({ business: { ...business(), accountingSetupStep: AccountSetupStep.COMPLETE } });
    refetch();
    navigate('/accounting?notification=setup');
  };

  const onCancelAccountingSetup = async () => {
    setHasIntegrationConnection(null);
    deleteIntegrationExpenseCategoryMappings();
    await deleteIntegrationConnection();
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.ADD_CREDIT_CARD });
  };

  return (
    <div>
      <Switch>
        <Match when={hasIntegrationConnection() === true}>
          <Switch>
            <Match when={business().accountingSetupStep === AccountSetupStep.AWAITING_SYNC}>
              <AwaitingCodatSync />
              <Button onClick={() => refetch()}></Button>
            </Match>
            <Match when={business().accountingSetupStep === AccountSetupStep.ADD_CREDIT_CARD}>
              <AddCreditCardForm onNext={onUpdateCreditCard} onCancel={onCancelAccountingSetup} />
            </Match>
            <Match when={business().accountingSetupStep === AccountSetupStep.MAP_CATEGORIES}>
              <ChartOfAccounts onNext={onCompleteChartOfAccounts} onCancel={onCancelAccountingSetup} />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </div>
  );
}
