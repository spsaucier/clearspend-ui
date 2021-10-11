import { Show, Switch, Match } from 'solid-js';
import { useLocation } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import twLogo from 'app/assets/tw-logo.svg';

import { SideSteps } from './components/SideSteps';
import { BusinessForm } from './components/BusinessForm';
import { TeamForm } from './components/TeamForm';

import css from './Onboarding.css';

export default function Onboarding() {
  const location = useLocation();
  const media = useMediaContext();

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
            <BusinessForm />
          </Page>
        </Match>
        <Match when={location.pathname === '/onboarding/kyc'}>
          <Page title="Tell us about your team" contentClass={css.content}>
            <TeamForm />
          </Page>
        </Match>
        <Match when={location.pathname === '/onboarding/account'}>
          <Page title="Link your bank account" contentClass={css.content}>
            TODO
          </Page>
        </Match>
        <Match when={location.pathname === '/onboarding/money'}>
          <Page title="Transfer money" contentClass={css.content}>
            TODO
          </Page>
        </Match>
      </Switch>
    </MainLayout>
  );
}
