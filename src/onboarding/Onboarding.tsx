import { Icon } from '_common/components/Icon';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import twLogo from 'app/assets/tw-logo.svg';

import css from './Onboarding.css';

export default function Onboarding() {
  return (
    <MainLayout
      side={
        <div class={css.sidebar}>
          <header class={css.header}>
            <img src={twLogo} alt="Company logo" />
          </header>
          <div class={css.steps}>TODO</div>
          <footer class={css.footer}>
            <Icon name="user" />
            <span class={css.user}>Ann Kim</span>
          </footer>
        </div>
      }
    >
      <Page title="Tell us about your business" contentClass={css.content}>
        <Section title="Business details" class={css.section}>
          TODO
        </Section>
        <Section title="Business address" class={css.section}>
          TODO
        </Section>
      </Page>
    </MainLayout>
  );
}
