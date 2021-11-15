import { createMemo, Show, JSXElement } from 'solid-js';

import { join } from '../../utils/join';

import { useGroupContext } from './context';

import css from './Radio.css';

export interface RadioProps {
  value: string;
  class?: string;
  disabled?: boolean;
  children?: JSXElement;
}

export function Radio(props: Readonly<RadioProps>) {
  const group = useGroupContext();

  const onChange = () => group.onChange?.(props.value);

  const checked = createMemo(() => props.value === group.value);
  const disabled = createMemo(() => props.disabled || group.disabled);

  return (
    <label class={join(css.root, props.class)}>
      <input
        type="radio"
        name={group.name}
        data-name={group.name}
        checked={checked()}
        disabled={disabled()}
        class={css.input}
        onChange={onChange}
      />
      <Show when={!group.empty} fallback={props.children}>
        <span class={css.dot} />
        <Show when={props.children}>
          <span class={css.label}>{props.children}</span>
        </Show>
      </Show>
    </label>
  );
}