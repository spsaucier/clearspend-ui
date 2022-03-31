import { Text } from 'solid-i18n';

import type { IntegrationOptionCardValues } from 'accounting/components/IntegrationOptionCard/types';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { IntegrationSignInCard } from 'accounting/components/IntegrationSignInCard';

interface IntegrateAppProps {
  integrationApp: IntegrationOptionCardValues;
}

export function IntegrateApp(props: IntegrateAppProps) {
  const { name } = props.integrationApp;

  return (
    <Page title={<Text message="{name} integration" name={name} />}>
      <Section
        title={<Text message="Connect your account" />}
        description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
      >
        <IntegrationSignInCard integrationApp={props.integrationApp} />
      </Section>
    </Page>
  );
}
