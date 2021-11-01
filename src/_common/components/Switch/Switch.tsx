import { JSX, JSXElement, Show } from 'solid-js';

import { join } from '../../utils/join';

import css from './Switch.css';

export interface SwitchProps {
  name?: string;
  value?: boolean;
  class?: string;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  children?: JSXElement;
}

export function Switch(props: Readonly<SwitchProps>) {
  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    props.onChange?.(event.currentTarget.checked);
  };

  return (
    <label class={join(css.root, props.class)}>
      <input
        type="checkbox"
        name={props.name}
        data-name={props.name}
        checked={props.value}
        disabled={props.disabled}
        class={css.input}
        onChange={onChange}
      />
      <span class={css.control} />
      <Show when={props.children}>
        <span class={css.label}>{props.children}</span>
      </Show>
    </label>
  );
}
