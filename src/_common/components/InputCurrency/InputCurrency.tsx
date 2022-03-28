import { onCleanup } from 'solid-js';

import type { JSXEvent } from '_common/types/common';
import { formatAmount } from '_common/formatters/amount';
import { join } from '_common/utils/join';

import { Input, type InputProps } from '../Input';

import css from './InputCurrency.css';

const CHANGE_TIMEOUT_MS = 800;

export interface InputCurrencyProps
  extends Omit<InputProps, 'formatter' | 'parser' | 'prefix' | 'suffix' | 'inputMode' | 'onChange'> {
  onChange: (value: string) => void;
}

export function InputCurrency(props: Readonly<InputCurrencyProps>) {
  let changeTimer: number | undefined;

  const onChange = (value: string, event: JSXEvent<HTMLInputElement, InputEvent>) => {
    clearTimeout(changeTimer);

    const input = event.currentTarget;
    props.onChange(value);

    changeTimer = setTimeout(() => {
      input.value = formatAmount(value);
    }, CHANGE_TIMEOUT_MS);
  };

  onCleanup(() => {
    clearTimeout(changeTimer);
  });

  return (
    <Input
      {...props}
      formatter={formatAmount}
      prefix={<span>$</span>}
      inputMode="numeric"
      inputClass={join(css.input, props.inputClass)}
      onChange={onChange}
    />
  );
}
