import { For } from 'solid-js';
import { Text } from 'solid-i18n';

import { Page } from 'app/components/Page';
import { getQboIntegrationLink } from 'onboarding/services/integrations';
import quickbooksLargeLogo from 'accounting/assets/quickbooks-large.svg';
import quickbooksSmallLogo from 'accounting/assets/quickbooks-small.svg';
import type { IntegrationOptionCardValues } from 'accounting/components/IntegrationOptionCard/types';

import { IntegrationOptionCard } from '../IntegrationOptionCard';

import css from './IntegrationOptions.css';

const integrationOptionCards: IntegrationOptionCardValues[] = [
  {
    name: 'QuickBooks Online',
    description: 'Sync your transactions and receipts with QBO',
    largeLogo: quickbooksLargeLogo,
    smallLogo: quickbooksSmallLogo,
    onClick: async () => {
      const result = await getQboIntegrationLink();
      if (result.data) {
        window.location.href = result.data as string;
      }
    },
  },
];

interface IntegrationOptionsProps {
  setIntegrationApp: (value: IntegrationOptionCardValues) => void;
}

export function IntegrationOptions(props: Readonly<IntegrationOptionsProps>) {
  return (
    <Page title={<Text message="Accounting" />} class={css.root}>
      <h3 class={css.integrationOptionsTitle}>
        <Text message="Link your accounting system to sync transactions and receipts" />
      </h3>
      <h4 class={css.integrationOptionsSubtitle}>
        {/* <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." /> */}
      </h4>
      <div class={css.integrationCardContainer}>
        <For each={integrationOptionCards}>
          {(item: IntegrationOptionCardValues) => (
            <IntegrationOptionCard cardDetails={item} onCardClick={props.setIntegrationApp} />
          )}
        </For>
      </div>
    </Page>
  );
}
