import { useContext, createMemo } from 'solid-js';
import type { JSX } from 'solid-js';

import { isString } from '../../utils/isString';
import { join } from '../../utils/join';
import { toggleArray } from '../../utils/toggleArray';

import type { CheckboxProps, CheckboxGroupProps } from './types';
import { GroupContext } from './context';

function getGroupChecked(group: Omit<CheckboxGroupProps, 'children'>, value?: string): boolean | undefined {
  return group.value && isString(value) ? group.value.includes(value) : undefined;
}

export function Checkbox(props: Readonly<CheckboxProps>) {
  const group = useContext(GroupContext);

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    if (isString(props.value)) group.onChange?.(toggleArray(group.value || [], props.value));
    props.onChange?.(event.currentTarget.checked);
  };

  const checked = createMemo(() => props.checked ?? getGroupChecked(group, props.value));
  const disabled = createMemo(() => props.disabled ?? group.disabled);

  return (
    <label class={join(props.class)}>
      <input type="checkbox" checked={checked()} disabled={disabled()} onChange={onChange} />
      {props.children}
    </label>
  );
}
