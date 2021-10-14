import { Show, Switch, Match } from 'solid-js';
import { useLocation, useNavigate } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import twLogo from 'app/assets/tw-logo.svg';

import { SideSteps } from './components/SideSteps';
import { BusinessForm } from './components/BusinessForm';
import { TeamForm } from './components/TeamForm';
import { LinkAccount } from './components/LinkAccount';
import { TransferMoney } from './components/TransferMoney';
import { setBusinessInfo } from './services/onboarding';
import {
  readBusinessProspectID,
  removeBusinessProspectID,
  saveBusinessOwnerID,
  saveBusinessID,
} from './utils/storeBusinessIDs';
import type { CreateBusinessInfo } from './types';

import css from './Onboarding.css';

export default function Onboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const media = useMediaContext();

  const onUpdateKYB = async (data: Readonly<CreateBusinessInfo>) => {
    const resp = await setBusinessInfo(readBusinessProspectID(), data);
    saveBusinessOwnerID(resp.businessOwnerId);
    saveBusinessID(resp.businessId);
    removeBusinessProspectID();
    navigate('/onboarding/kyc');
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
              <SideSteps />
            </div>
          </Show>
          <footer class={css.footer}>
            <Icon name="user" />
            <span class={css.user}>Ann Kim</span>
          </footer>
        </div>
      }
    >
      <Switch>
        <Match when={location.pathname === '/onboarding/kyb'}>
          <Page title="Tell us about your business" contentClass={css.content}>
            <BusinessForm onNext={onUpdateKYB} />
          </Page>
        </Match>
        <Match when={location.pathname === '/onboarding/kyc'}>
          <Page title="Tell us about your team" contentClass={css.content}>
            <TeamForm />
          </Page>
        </Match>
        <Match when={location.pathname === '/onboarding/account'}>
          <Page title="Link your bank account" contentClass={css.content}>
            <LinkAccount />
          </Page>
        </Match>
        <Match when={location.pathname === '/onboarding/money'}>
          <Page title="Transfer money" contentClass={css.content}>
            <TransferMoney />
          </Page>
        </Match>
      </Switch>
    </MainLayout>
  );
}
