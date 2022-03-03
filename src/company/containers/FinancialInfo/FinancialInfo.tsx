import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { InternalBankAccount } from 'onboarding/components/InternalBankAccount/InternalBankAccount';

import css from './FinancialInfo.css';

export function FinancialInfo() {
  return (
    <Section
      title="ClearSpend"
      description={
        <Text
          message={
            'Use these virtual account details to send money from your bank account ' +
            'to your ClearSpend account via ACH or wire transfer.'
          }
        />
      }
      class={css.section}
    >
      <InternalBankAccount numberLinesOnly />
    </Section>
  );
}
