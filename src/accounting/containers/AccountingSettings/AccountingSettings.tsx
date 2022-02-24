import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { Button } from '_common/components/Button';

import css from './AccountingSettings.css';

export function AccountingSettings() {
  return (
    <Section
      title={<Text message="Unlink Account" />}
      description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
    >
      <Button size="lg" icon="trash" class={css.unlink}>
        <Text message="Unlink account" />
      </Button>
    </Section>
  );
}
