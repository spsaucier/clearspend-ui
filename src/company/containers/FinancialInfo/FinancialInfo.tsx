import { createMemo } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { useBool } from '_common/utils/useBool';
import { formatRoutingNumber } from '_common/formatters/routingNumber';
import { Button } from '_common/components/Button';
import { Section } from 'app/components/Section';
import { DataRow } from 'app/components/DataRow';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import type { Business } from 'generated/capital';

import css from './FinancialInfo.css';

interface FinancialInfoProps {
  data: Readonly<Business>;
}

export function FinancialInfo(props: Readonly<FinancialInfoProps>) {
  const [showAccountNumber, toggleAccountNumber] = useBool();

  const accountNumber = createMemo(() => {
    const number = props.data.accountNumber;
    return !showAccountNumber() ? formatAccountNumber(number) : number;
  });

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
      <DataRow icon="payment-bank" class={css.data}>
        <span class={css.dataLabel}>
          <Text message="Account number" />:
        </span>
        <span class={join(css.dataValue, css.accountNumber)}>{accountNumber()}</span>
        <Button
          icon="view"
          size="sm"
          type="primary"
          view="ghost"
          class={css.viewButton}
          onClick={toggleAccountNumber}
        />
      </DataRow>
      <DataRow icon="channel-subscription" class={css.data}>
        <span class={css.dataLabel}>
          <Text message="Routing number" />:
        </span>
        <span class={css.dataValue}>{formatRoutingNumber(props.data.routingNumber || '')}</span>
      </DataRow>
    </Section>
  );
}
