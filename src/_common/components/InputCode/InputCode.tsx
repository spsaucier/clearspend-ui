import { Index } from 'solid-js';

import { Input } from '../Input';
import { join } from '../../utils/join';
import { times } from '../../utils/times';

import css from './InputCode.css';

export interface InputCodeProps {
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);
  name?: string;
  value: string;
  codeLength: number;
  error?: boolean;
  disabled?: boolean;
  class?: string;
  onChange: (value: string) => void;
}

export function InputCode(props: Readonly<InputCodeProps>) {
  const inputs: HTMLInputElement[] = [];

  const setRef = (idx: number) => (el: HTMLInputElement) => {
    if (idx === 0 && typeof props.ref === 'function') props.ref(el);
    inputs[idx] = el;
  };

  const getValue = () => inputs.map((el) => el.value || '').join('');

  const setValue = (value: string) => {
    value.split('').forEach((val, idx) => {
      if (inputs[idx]) inputs[idx]!.value = val;
    });
  };

  const onChange = (idx: number) => {
    return (value: string, event: InputEvent) => {
      // Safari's auto paste from SMS
      if (event instanceof CustomEvent) {
        if (value.length === props.codeLength) {
          setValue(value);
          props.onChange(value);
        }
        return;
      }

      if (event.inputType === 'insertText') inputs[idx + 1]?.focus();
      else if (event.inputType === 'deleteContentBackward') inputs[idx - 1]?.focus();
      props.onChange(getValue());
    };
  };

  const onKeyDown = (idx: number) => {
    return (event: KeyboardEvent) => {
      if (event.code === 'Backspace' && !(event.target as HTMLInputElement).value) {
        event.preventDefault();
        inputs[idx - 1]?.focus();
      }
    };
  };

  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    setValue(event.clipboardData?.getData('text') || '');
    props.onChange(getValue());
  };

  return (
    <div data-name={props.name} class={join(css.root, props.class)}>
      <Index each={times(props.codeLength)}>
        {(_: unknown, idx: number) => (
          <Input
            ref={setRef(idx)}
            value={(props.value || '')[idx] || ''}
            maxLength={1}
            inputMode="numeric"
            autoComplete="off"
            error={props.error}
            disabled={props.disabled}
            class={css.input}
            onChange={onChange(idx)}
            onKeyDown={onKeyDown(idx)}
            onPaste={onPaste}
          />
        )}
      </Index>
    </div>
  );
}
