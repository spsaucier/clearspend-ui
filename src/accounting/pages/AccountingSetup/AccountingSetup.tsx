import { createSignal, Match, onMount, Switch } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import {
  deleteIntegrationConnection,
  deleteIntegrationExpenseCategoryMappings,
  getCompanyConnection,
  postAccountingStepToBusiness,
} from 'accounting/services';
import { useBusiness } from 'app/containers/Main/context';
import { AccountSetupStep } from 'app/types/businesses';

import { AddCreditCardForm } from '../AddCreditCardForm';
import { ChartOfAccounts } from '../ChartOfAccounts';

export default function AccountingSetup() {
  const { business, signupUser, mutate, permissions } = useBusiness();

  const [step, setStep] = createSignal<AccountSetupStep | undefined>(
    business().accountingSetupStep as AccountSetupStep,
  );
  const [hasIntegrationConnection, setHasIntegrationConnection] = createSignal<boolean | null>(null);

  const navigate = useNavigate();

  const onUpdateCreditCard = async () => {
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.MAP_CATEGORIES });
    setStep(AccountSetupStep.MAP_CATEGORIES);
  };

  const getCompanyConnectionState = async () => {
    const res = await getCompanyConnection();
    setHasIntegrationConnection(res);
  };

  onMount(async () => {
    getCompanyConnectionState();
    if (step() === AccountSetupStep.COMPLETE) {
      navigate('/accounting');
    }
  });

  const onCompleteChartOfAccounts = async () => {
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.COMPLETE });
    setStep(AccountSetupStep.COMPLETE);
    mutate([signupUser(), { ...business(), accountingSetupStep: AccountSetupStep.COMPLETE }, permissions()]);
    navigate('/accounting?notification=setup');
  };

  const onCancelAccountingSetup = async () => {
    setHasIntegrationConnection(null);
    deleteIntegrationExpenseCategoryMappings();
    await deleteIntegrationConnection();
    postAccountingStepToBusiness({ accountingSetupStep: AccountSetupStep.ADD_CREDIT_CARD });
    setStep(AccountSetupStep.ADD_CREDIT_CARD);
  };

  return (
    <div>
      <Switch>
        <Match when={hasIntegrationConnection() === true}>
          <Switch>
            <Match when={step() === AccountSetupStep.ADD_CREDIT_CARD}>
              <AddCreditCardForm onNext={onUpdateCreditCard} onCancel={onCancelAccountingSetup} />
            </Match>
            <Match when={step() === AccountSetupStep.MAP_CATEGORIES}>
              <ChartOfAccounts onNext={onCompleteChartOfAccounts} onCancel={onCancelAccountingSetup} />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </div>
  );
}
