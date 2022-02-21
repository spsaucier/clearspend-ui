import { mergeProps } from 'solid-js';
import type { JSX, JSXElement } from 'solid-js';

import { join } from '../../utils/join';

import css from './Input.css';

export interface InputProps {
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);
  name?: string;
  value?: string | number;
  maxLength?: number;
  type?: 'text' | 'password' | 'email' | 'tel' | 'file' | 'number';
  inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  autoComplete?: string;
  placeholder?: string;
  prefix?: JSXElement;
  suffix?: JSXElement;
  error?: boolean;
  disabled?: boolean;
  class?: string;
  inputClass?: string;
  onClick?: (event: MouseEvent) => void;
  onChange?: (value: string, event: InputEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;
  onFocusIn?: (event: FocusEvent) => void;
  onFocusOut?: (event: FocusEvent) => void;
  darkMode?: boolean;
}

export function Input(props: Readonly<InputProps>) {
  let input!: HTMLInputElement;
  const merged = mergeProps({ type: 'text' }, props);

  const setInputRef = (element: HTMLInputElement) => {
    if (typeof merged.ref === 'function') merged.ref(element);
    input = element;
  };

  const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    if (typeof merged.parser === 'function') {
      merged.onChange?.(merged.parser(event.currentTarget.value), event);
    } else {
      merged.onChange?.(event.currentTarget.value, event);
    }
  };

  const applyFormatter = (text?: string | number) => {
    if (typeof merged.formatter === 'function') {
      return merged.formatter(`${text}`);
    } else {
      return text;
    }
  };

  return (
    <div
      class={join(css.root, merged.class, props.darkMode && css.dark)}
      classList={{ [css.error!]: merged.error, [css.disabled!]: merged.disabled }}
    >
      {merged.prefix && <div class={css.prefix}>{merged.prefix}</div>}
      <input
        ref={setInputRef}
        name={merged.name}
        data-name={merged.name}
        value={applyFormatter(merged.value || '')}
        maxLength={merged.maxLength}
        type={merged.type}
        inputmode={merged.inputMode}
        autocomplete={merged.autoComplete}
        placeholder={merged.placeholder}
        disabled={merged.disabled}
        class={join(css.input, merged.inputClass)}
        onInput={onChange}
        onClick={merged.onClick}
        onKeyDown={merged.onKeyDown}
        onPaste={merged.onPaste}
        onFocusIn={merged.onFocusIn}
        onFocusOut={merged.onFocusOut}
      />
      {merged.suffix && <div class={css.suffix}>{merged.suffix}</div>}
    </div>
  );
}
