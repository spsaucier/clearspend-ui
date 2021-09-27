import { mergeProps } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';

interface InputProps {
  name?: string;
  value?: string;
  type?: 'text' | 'password';
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
    <div class={join(merged.class)}>
      <input
        name={merged.name}
        value={merged.value}
        type={merged.type}
        placeholder={merged.placeholder}
        disabled={merged.disabled}
        onInput={onChange}
      />
    </div>
  );
}
