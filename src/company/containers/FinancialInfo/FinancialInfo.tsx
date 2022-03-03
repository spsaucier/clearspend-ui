import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import type { Business } from 'generated/capital';

import { InternalBankAccount } from '../../../onboarding/components/InternalBankAccount/InternalBankAccount';

import css from './FinancialInfo.css';

interface FinancialInfoProps {
  data: Readonly<Business>;
}

export function FinancialInfo(props: Readonly<FinancialInfoProps>) {
  return (
    <Section
      title={props.data.legalName}
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
