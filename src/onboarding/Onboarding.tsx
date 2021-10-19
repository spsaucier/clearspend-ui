import { createSignal, batch, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import twLogo from 'app/assets/tw-logo.svg';
import { readSignupName } from 'signup/storage';

import { SideSteps } from './components/SideSteps';
import { BusinessForm } from './components/BusinessForm';
import { TeamForm } from './components/TeamForm';
import { LinkAccount } from './components/LinkAccount';
import { TransferMoney, AccountsData } from './components/TransferMoney';
import { setBusinessInfo, setBusinessOwner } from './services/onboarding';
import { getBusinessAccounts, deposit } from './services/accounts';
import {
  readBusinessID,
  readBusinessProspectID,
  removeBusinessProspectID,
  saveBusinessOwnerID,
  readBusinessOwnerID,
  removeBusinessOwnerID,
  saveBusinessID,
} from './storage';
import { OnboardingStep, UpdateBusinessInfo, UpdateBusinessOwner } from './types';

import css from './Onboarding.css';

export default function Onboarding() {
  const media = useMediaContext();
  const navigate = useNavigate();
  const name = readSignupName();

  // TODO: Check init
  const [step, setStep] = createSignal<OnboardingStep>(OnboardingStep.kyb);
  const [accounts, setAccounts] = createSignal<AccountsData>();

  const onUpdateKYB = async (data: Readonly<UpdateBusinessInfo>) => {
    const resp = await setBusinessInfo(readBusinessProspectID(), data);
    saveBusinessOwnerID(resp.businessOwnerId);
    saveBusinessID(resp.businessId);
    removeBusinessProspectID();
    setStep(OnboardingStep.kyc);
  };

  const onUpdateKYC = async (data: Readonly<UpdateBusinessOwner>) => {
    await setBusinessOwner(readBusinessOwnerID(), data);
    removeBusinessOwnerID();
    setStep(OnboardingStep.account);
  };

  const onGotVerifyToken = async (data: Readonly<PlaidMetadata>) => {
    const innerAccounts = await getBusinessAccounts(readBusinessID(), data.public_token);
    batch(() => {
      setAccounts({ plaid: data.accounts, inner: innerAccounts });
      setStep(OnboardingStep.money);
    });
  };

  const onDeposit = async (accountId: string, amount: number) => {
    await deposit(readBusinessID(), accountId, amount);
    navigate('/');
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
            <Show when={Boolean(name)}>
              <Icon name="user" />
              <span class={css.user}>{`${name!.firstName} ${name!.lastName}`}</span>
            </Show>
          </footer>
        </div>
      }
    >
      <Switch>
        <Match when={step() === OnboardingStep.kyb}>
          <Page title="Tell us about your business" contentClass={css.content}>
            <BusinessForm onNext={onUpdateKYB} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.kyc}>
          <Page title="Tell us about your team" contentClass={css.content}>
            <TeamForm onNext={onUpdateKYC} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.account}>
          <Page title="Link your bank account" contentClass={css.content}>
            <LinkAccount onNext={onGotVerifyToken} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.money}>
          <Page title="Transfer money" contentClass={css.content}>
            <Show when={accounts()}>
              <TransferMoney data={accounts()!} onDeposit={onDeposit} />
            </Show>
          </Page>
        </Match>
      </Switch>
    </MainLayout>
  );
}
