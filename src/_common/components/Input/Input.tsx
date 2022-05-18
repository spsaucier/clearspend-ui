import { createMemo, Show, type JSX, type JSXElement } from 'solid-js';

import type { JSXEvent } from '../../types/common';
import { join } from '../../utils/join';

import css from './Input.css';

const DEFAULT_TEXT_ROWS = 3;

interface SharedProps {
  name?: string;
  value?: string; // string only!!!
  maxLength?: number;
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
  darkMode?: boolean;
  onClick?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;
  onFocusIn?: (event: FocusEvent) => void;
  onFocusOut?: (event: FocusEvent) => void;
}

export interface InputProps extends SharedProps {
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);
  type?: 'text' | 'password' | 'email' | 'tel' | 'file' | 'number';
  onChange?: (value: string, event: JSXEvent<HTMLInputElement, InputEvent>) => void;
  onBlur?: JSX.HTMLAttributes<HTMLInputElement>['onBlur'];
}

export interface TextAreaProps extends SharedProps {
  useTextArea: true;
  rows?: number;
  ref?: HTMLTextAreaElement | ((el: HTMLTextAreaElement) => void);
  onChange?: (value: string, event: JSXEvent<HTMLTextAreaElement, InputEvent>) => void;
  onBlur?: JSX.HTMLAttributes<HTMLTextAreaElement>['onBlur'];
}

export function Input(props: Readonly<InputProps | TextAreaProps>) {
  let input!: HTMLInputElement | HTMLTextAreaElement;

  const setInputRef = (element: HTMLInputElement | HTMLTextAreaElement) => {
    if (typeof props.ref === 'function') props.ref(element as HTMLInputElement & HTMLTextAreaElement);
    input = element;
  };

  const value = createMemo<string>(() => {
    const text = props.value || '';
    return typeof props.formatter === 'function' ? props.formatter(text) : text;
  });

  const onChange = (event: JSXEvent<HTMLInputElement | HTMLTextAreaElement, InputEvent>) => {
    let text = event.currentTarget.value;
    if (typeof props.parser === 'function') text = props.parser(text);
    props.onChange?.(text, event as JSXEvent<HTMLInputElement & HTMLTextAreaElement, InputEvent>);
  };

  const shared = createMemo(() => ({
    ref: setInputRef,
    name: props.name,
    'data-name': props.name,
    value: value(),
    maxLength: props.maxLength,
    inputmode: props.inputMode,
    autocomplete: props.autoComplete,
    placeholder: props.placeholder,
    disabled: props.disabled,
    class: join(css.input, props.inputClass),
    onInput: onChange,
    onClick: props.onClick,
    onKeyDown: props.onKeyDown,
    onPaste: props.onPaste,
    onFocusIn: props.onFocusIn,
    onFocusOut: props.onFocusOut,
    onBlur: props.onBlur as JSX.HTMLAttributes<HTMLElement>['onBlur'],
  }));

  return (
    <div
      class={css.root}
      classList={{
        [props.class!]: !!props.class,
        [css.dark!]: props.darkMode,
        [css.autoHeight!]: (props as TextAreaProps).useTextArea,
        [css.error!]: props.error,
        [css.disabled!]: props.disabled,
      }}
    >
      {props.prefix && <div class={css.prefix}>{props.prefix}</div>}
      <Show
        when={!('useTextArea' in props)}
        fallback={<textarea rows={(props as TextAreaProps).rows ?? DEFAULT_TEXT_ROWS} {...shared()} />}
      >
        <input type={(props as InputProps).type || 'text'} {...shared()} />
      </Show>
      {props.suffix && <div class={css.suffix}>{props.suffix}</div>}
    </div>
  );
}
