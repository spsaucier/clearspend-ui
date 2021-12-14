import { useI18n, Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { SwitchBox } from 'app/components/SwitchBox';
import { FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { formatCurrency } from '_common/api/intl/formatCurrency';

import css from './CardControls.css';

export function CardControls() {
  const i18n = useI18n();

  return (
    <Section
      title={<Text message="Default Card Controls" />}
      description={
        <Text
          message={
            'Set default limits for how much can be spent with cards in this allocation. ' +
            'These can be customized when issuing new cards.'
          }
        />
      }
    >
      <div class={css.content}>
        <SwitchBox checked={false} label={<Text message="Daily limit" />}>
          <FormItem
            label={<Text message="Amount" />}
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            extra={<Text message="Max value: {amount}" amount={formatCurrency(4570.04)} />}
          >
            <Input placeholder={String(i18n.t('$ Enter the amount'))} />
          </FormItem>
        </SwitchBox>
        <SwitchBox checked={true} label={<Text message="Monthly limit" />}>
          <FormItem
            label={<Text message="Amount" />}
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            extra={<Text message="Max value: {amount}" amount={formatCurrency(4570.04)} />}
          >
            <Input placeholder={String(i18n.t('$ Enter the amount'))} />
          </FormItem>
        </SwitchBox>
      </div>
    </Section>
  );
}
