import { mergeProps } from 'solid-js';
import type { JSX, JSXElement } from 'solid-js';

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
  suffix?: JSXElement;
  error?: boolean;
  disabled?: boolean;
  class?: string;
  onChange?: (value: string, event: InputEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;
  onFocusIn?: (event: FocusEvent) => void;
  onFocusOut?: (event: FocusEvent) => void;
}

export function Input(props: Readonly<InputProps>) {
  const merged = mergeProps({ type: 'text' }, props);

  const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    merged.onChange?.(event.currentTarget.value, event);
  };

  return (
    <div
      class={join(css.root, merged.class)}
      classList={{ [css.error!]: merged.error, [css.disabled!]: merged.disabled }}
    >
      <input
        ref={props.ref}
        name={merged.name}
        data-name={merged.name}
        value={merged.value || ''}
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
        onFocusIn={merged.onFocusIn}
        onFocusOut={merged.onFocusOut}
      />
      {merged.suffix && <div class={css.suffix}>{merged.suffix}</div>}
    </div>
  );
}
