import { createSignal, createMemo } from 'solid-js';

import { Input } from '../Input';
import { Icon } from '../Icon';
import { Popover } from '../Popover';

import css from './InputDate.css';

const FOCUS_OUT_DELAY = 200;

export interface InputDateProps {
  name?: string;
  class?: string;
  value?: Date | number;
  error?: boolean;
  onChange?: (date: Date | null) => void;
}

export function InputDate(props: Readonly<InputDateProps>) {
  const [open, setOpen] = createSignal(false);

  let focusTimeout: number;
  const clearFocusTimeout = () => clearTimeout(focusTimeout);

  const onChange = (value: string) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };

  const value = createMemo(() => {
    const date = props.value;
    if (typeof date === 'number') return new Date(date);
    if (date instanceof Date) return date;
    return undefined;
  });

  return (
    <Popover
      open={open()}
      class={css.popup}
      onClickOutside={() => setOpen(false)}
      content={
        <div class={css.calendar} onClick={clearFocusTimeout}>
          TODO
        </div>
      }
    >
      <Input
        name={props.name}
        value={value()?.toLocaleDateString()}
        suffix={<Icon name="calendar" />}
        class={props.class}
        error={props.error}
        onFocusIn={() => setOpen(true)}
        onFocusOut={() => {
          clearFocusTimeout();
          focusTimeout = setTimeout(() => setOpen(false), FOCUS_OUT_DELAY);
        }}
        onChange={onChange}
      />
    </Popover>
  );
}
