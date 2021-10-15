import { createSignal, Show, Switch, Match } from 'solid-js';

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
import { TransferMoney } from './components/TransferMoney';
import { setBusinessInfo, setBusinessOwner } from './services/onboarding';
import {
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
  const name = readSignupName();

  // TODO: Check init
  const [step, setStep] = createSignal<OnboardingStep>(OnboardingStep.kyb);

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
            <LinkAccount />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.money}>
          <Page title="Transfer money" contentClass={css.content}>
            <TransferMoney />
          </Page>
        </Match>
      </Switch>
    </MainLayout>
  );
}
