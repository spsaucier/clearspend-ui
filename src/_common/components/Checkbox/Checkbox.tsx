import { useContext, createMemo, Show } from 'solid-js';
import type { JSX } from 'solid-js';

import { isString } from '../../utils/isString';
import { join } from '../../utils/join';
import { toggleArray } from '../../utils/toggleArray';

import { Tick } from './Tick';
import type { CheckboxValue, CheckboxProps } from './types';
import { GroupContext, type ContextType } from './context';

import css from './Checkbox.css';

function getGroupChecked<T>(group: ContextType<T>, value?: T): boolean | undefined {
  return group.value && isString(value) ? group.value.includes(value) : undefined;
}

export function Checkbox<T extends CheckboxValue>(props: Readonly<CheckboxProps<T>>) {
  const group = useContext<ContextType<T>>(GroupContext);

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    if (isString(props.value)) group.onChange?.(toggleArray(group.value || [], props.value));
    props.onChange?.(event.currentTarget.checked);
  };

  const name = createMemo(() => (group.name ? `${group.name}_${props.value}` : props.value));
  const checked = createMemo(() => props.checked ?? getGroupChecked(group, props.value));
  const disabled = createMemo(() => props.disabled ?? group.disabled);

  return (
    <label class={join(css.root, props.class)} onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        name={name()}
        data-name={name()}
        checked={checked()}
        disabled={disabled()}
        class={css.input}
        onChange={onChange}
      />
      <Show when={!group.empty} fallback={props.children}>
        <Tick darkMode={props.darkMode} class={css.control} />
        <Show when={props.children}>
          <span class={css.label}>{props.children}</span>
        </Show>
      </Show>
    </label>
  );
}
