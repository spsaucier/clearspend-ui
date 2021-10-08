import { mergeProps } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';

import css from './Input.css';

export interface InputProps {
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);
  name?: string;
  value?: string;
  maxLength?: number;
  type?: 'text' | 'password' | 'email' | 'tel';
  inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  autoComplete?: string;
  placeholder?: string;
  error?: boolean; // TODO
  disabled?: boolean;
  class?: string;
  onChange?: (value: string, event: InputEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;
}

export function Input(props: Readonly<InputProps>) {
  const merged = mergeProps({ type: 'text' }, props);

  const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    merged.onChange?.(event.currentTarget.value, event);
  };

  return (
    <div class={join(css.root, merged.class)} classList={{ [css.disabled!]: merged.disabled }}>
      <input
        ref={props.ref}
        name={merged.name}
        value={merged.value}
        maxLength={merged.maxLength}
        type={merged.type}
        inputmode={merged.inputMode}
        autocomplete={merged.autoComplete}
        placeholder={merged.placeholder}
        disabled={merged.disabled}
        class={css.input}
        onInput={onChange}
        onKeyDown={merged.onKeyDown}
        onPaste={merged.onPaste}
      />
    </div>
  );
}
