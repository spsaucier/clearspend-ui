import { splitProps } from 'solid-js';

import type { JSXEvent } from '_common/types/common';
import { formatAmount } from '_common/formatters/amount';
import { join } from '_common/utils/join';

import { Input, type InputProps } from '../Input';

import css from './InputCurrency.css';

export interface InputCurrencyProps
  extends Omit<InputProps, 'formatter' | 'parser' | 'prefix' | 'suffix' | 'inputMode' | 'onChange'> {
  onChange: (value: string) => void;
}

export function InputCurrency(props: Readonly<InputCurrencyProps>) {
  const [local, others] = splitProps(props, ['inputClass']);

  const onFocusOut = (event: FocusEvent) => {
    const input = (event as JSXEvent<HTMLInputElement, FocusEvent>).currentTarget;

    const current = input.value;
    const formatted = formatAmount(current);

    if (current !== formatted) input.value = formatted;
    if (others.value !== formatted) others.onChange(formatted);
  };

  return (
    <Input
      {...others}
      formatter={formatAmount}
      prefix={<span>$</span>}
      inputMode="numeric"
      inputClass={join(css.input, local.inputClass)}
      onFocusOut={onFocusOut}
    />
  );
}
