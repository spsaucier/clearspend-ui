import { mergeProps } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';

import css from './Input.css';

export interface InputProps {
  name?: string;
  value?: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  autocomplete?: string;
  placeholder?: string;
  error?: boolean; // TODO
  disabled?: boolean;
  class?: string;
  onChange?: (value: string) => void;
}

export function Input(props: Readonly<InputProps>) {
  const merged = mergeProps({ type: 'text' }, props);

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    merged.onChange?.(event.currentTarget.value);
  };

  return (
    <div class={join(css.root, merged.class)}>
      <input
        name={merged.name}
        value={merged.value}
        type={merged.type}
        autocomplete={merged.autocomplete}
        placeholder={merged.placeholder}
        disabled={merged.disabled}
        class={css.input}
        onInput={onChange}
      />
    </div>
  );
}
