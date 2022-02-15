import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';

import type { IntegrationOptionCardValues } from './types';

import css from './IntegrationOptionCard.css';

interface IntegrationOptionCardProps {
  cardDetails: IntegrationOptionCardValues;
  onCardClick: (value: IntegrationOptionCardValues) => void;
}

export function IntegrationOptionCard(props: Readonly<IntegrationOptionCardProps>) {
  const { name, description, largeLogo } = props.cardDetails;

  return (
    <div class={css.root}>
      <div class={css.iconTitleContainer}>
        <img src={largeLogo} alt={`${name} logo`} />
        <h3 class={css.integrationOptionsCardTitle}>
          <Text message={name} />
        </h3>
      </div>
      <h4 class={css.integrationOptionsCardText}>
        <Text message={description} />
      </h4>
      <Button size="lg" icon="connect" class={css.button} onClick={() => props.onCardClick(props.cardDetails)}>
        <Text message="Connect" />
      </Button>
    </div>
  );
}
