import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { formatRoutingNumber } from '_common/formatters/routingNumber';
import { Section } from 'app/components/Section';
import { DataRow } from 'app/components/DataRow';
import type { Business } from 'generated/capital';

import css from './FinancialInfo.css';

interface FinancialInfoProps {
  data: Readonly<Business>;
}

export function FinancialInfo(props: Readonly<FinancialInfoProps>) {
  return (
    <Section
      title={props.data.legalName}
      description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor.'}
      class={css.section}
    >
      <DataRow icon="payment-bank" class={css.data}>
        <span class={css.dataLabel}>
          <Text message="Account number" />:
        </span>
        <span class={join(css.dataValue, css.accountNumber)}>{props.data.accountNumber}</span>
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
