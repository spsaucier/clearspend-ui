import { createMemo, Show } from 'solid-js';

import { join } from '../../utils/join';

import { useGroupContext } from './context';
import type { RadioValue, RadioProps } from './types';

import css from './Radio.css';

export function Radio<T extends RadioValue>(props: Readonly<RadioProps<T>>) {
  const group = useGroupContext<T>();

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
