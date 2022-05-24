import { Text } from 'solid-i18n';

import { SwitchGroupBox } from 'app/components/SwitchGroupBox';

import { PAYMENT_TYPES } from '../../constants/limits';

interface SwitchPaymentTypesProps {
  value: readonly string[];
  class?: string;
  disabled?: boolean;
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
      disabled={props.disabled}
      onChange={props.onChange}
    />
  );
}
