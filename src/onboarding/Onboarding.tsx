import { createSignal, batch, Show, Switch, Match } from 'solid-js';

import { Icon } from '_common/components/Icon';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { useBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { ownerStore } from 'app/stores/owner';
import { OnboardingStep } from 'app/types/businesses';
import twLogo from 'app/assets/tw-logo.svg';

import { SideSteps } from './components/SideSteps';
import { BusinessForm } from './components/BusinessForm';
import { TeamForm } from './components/TeamForm';
import { LinkAccount } from './components/LinkAccount';
import { TransferMoney } from './components/TransferMoney';
import { setBusinessInfo, setBusinessOwner } from './services/onboarding';
import { linkBankAccounts, getBankAccounts, deposit } from './services/accounts';
import { readBusinessProspectID } from './storage';
import type { UpdateBusinessInfo, UpdateBusinessOwner, LinkedBankAccounts } from './types';

import css from './Onboarding.css';

export default function Onboarding() {
  const media = useMediaContext();
  const messages = useMessages();

  const { business, refetch } = useBusiness();

  const [step, setStep] = createSignal<OnboardingStep>(business().onboardingStep);
  const [accounts, setAccounts] = createSignal<readonly Readonly<LinkedBankAccounts>[]>([]);

  if (business().onboardingStep === OnboardingStep.TRANSFER_MONEY) {
    getBankAccounts()
      .then((data) => setAccounts(data))
      .catch(() => messages.error({ title: 'Something going wrong' }));
  }

  const onUpdateKYB = async (data: Readonly<UpdateBusinessInfo>) => {
    await setBusinessInfo(readBusinessProspectID(), data);
    // TODO
    // removeBusinessProspectID();
    setStep(OnboardingStep.BUSINESS_OWNERS);
  };

  const onUpdateKYC = async (data: Readonly<UpdateBusinessOwner>) => {
    await setBusinessOwner(ownerStore.data.userId, { ...data, isOnboarding: true });
    setStep(OnboardingStep.LINK_ACCOUNT);
  };

  const onGotVerifyToken = async (token: string) => {
    const bankAccounts = await linkBankAccounts(token);
    batch(() => {
      setAccounts(bankAccounts);
      setStep(OnboardingStep.TRANSFER_MONEY);
    });
  };

  const onDeposit = async (accountId: string, amount: number) => {
    await deposit(accountId, amount);
    await refetch();
  };

  return (
    <MainLayout
      side={
        <div class={css.sidebar}>
          <header class={css.header}>
            <img src={twLogo} alt="Company logo" width={123} height={24} />
          </header>
          <Show when={media.medium}>
            <div class={css.steps}>
              <SideSteps step={step()} />
            </div>
          </Show>
          <footer class={css.footer}>
            <Icon name="user" />
            <span class={css.user}>{`${ownerStore.data.firstName} ${ownerStore.data.lastName}`}</span>
          </footer>
        </div>
      }
    >
      <Switch>
        <Match when={!step()}>
          <Page title="Tell us about your business">
            <BusinessForm onNext={onUpdateKYB} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.BUSINESS_OWNERS}>
          <Page title="Tell us about your team">
            <TeamForm onNext={onUpdateKYC} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.LINK_ACCOUNT}>
          <Page title="Link your bank account">
            <LinkAccount onNext={onGotVerifyToken} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.TRANSFER_MONEY}>
          <Page title="Transfer money">
            <Show when={accounts()}>
              <TransferMoney accounts={accounts()} onDeposit={onDeposit} />
            </Show>
          </Page>
        </Match>
      </Switch>
    </MainLayout>
  );
}
