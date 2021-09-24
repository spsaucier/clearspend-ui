import { useContext, createMemo } from 'solid-js';
import type { JSX } from 'solid-js';

import { isString } from '../../utils/isString';
import { toggleArrayItem } from '../../utils/toggleArrayItem';

import type { CheckboxProps, CheckboxGroupProps } from './types';
import { GroupContext } from './context';

function getContextChecked(group: Omit<CheckboxGroupProps, 'children'>, value?: string): boolean | undefined {
  return group.value && isString(value) ? group.value.includes(value) : undefined;
}

export function Checkbox(props: Readonly<CheckboxProps>) {
  const group = useContext(GroupContext);

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    if (isString(props.value)) group.onChange?.(toggleArrayItem(group.value || [], props.value));
    props.onChange?.(event.currentTarget.checked);
  };

  const checked = createMemo(() => props.checked ?? getContextChecked(group, props.value));
  const disabled = createMemo(() => props.disabled ?? group.disabled);

  return (
    <label>
      <input type="checkbox" checked={checked()} disabled={disabled()} class={props.class} onChange={onChange} />
      {props.children}
    </label>
  );
}
