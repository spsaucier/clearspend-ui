import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { Button } from '_common/components/Button';

import type { IntegrationOptionCardValues } from '../IntegrationOptionCard/types';

import css from './IntegrationSignInCard.css';

interface IntegrationSignInCardProps {
  integrationApp: IntegrationOptionCardValues;
}

export function IntegrationSignInCard(props: IntegrationSignInCardProps) {
  const { name, smallLogo, onClick } = props.integrationApp;
  const [buttonDisabled, setButtonDisabled] = createSignal(false);

  return (
    <div class={css.root}>
      <h4 class={css.title}>
        <Text message="Sign into {name}" name={name} />
      </h4>
      <p class={css.text}>
        <Text message="Sign into {name} and connect to your ClearSpend account" name={name} />
      </p>
      <Button
        class={css.button}
        size="lg"
        disabled={buttonDisabled()}
        onClick={() => {
          setButtonDisabled(true);
          onClick();
        }}
      >
        <div class={css.buttonContent}>
          <img class={css.buttonIcon} src={smallLogo} />
          <Text message="Sign into {name}" name={name} />
        </div>
      </Button>
    </div>
  );
}
