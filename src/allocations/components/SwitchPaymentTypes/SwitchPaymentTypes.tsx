import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { SwitchGroupBox, SwitchGroupBoxItem } from 'app/components/SwitchGroupBox';

export const PAYMENT_TYPES: readonly Readonly<SwitchGroupBoxItem>[] = [
  { key: 'ATM', icon: 'channel-atm', name: i18n.t('ATM withdrawals') },
  { key: 'POS', icon: 'payment-card', name: i18n.t('Point of sale (POS)') },
  { key: 'MOTO', icon: 'channel-moto', name: i18n.t('Mail/telephone order') },
  { key: 'ONLINE', icon: 'channel-ecommerce', name: i18n.t('Online') },
];

interface SwitchPaymentTypesProps {
  value: readonly string[];
  class?: string;
  onChange: (value: string[]) => void;
}

export function SwitchPaymentTypes(props: Readonly<SwitchPaymentTypesProps>) {
  return (
    <SwitchGroupBox
      name="payment-types"
      value={props.value}
      allTitle={<Text message="All payment types" />}
      items={PAYMENT_TYPES}
      class={props.class}
      onChange={props.onChange}
    />
  );
}
