import { useContext, createMemo, Show } from 'solid-js';

import { Icon } from '../Icon';
import { join } from '../../utils/join';

import { SelectContext } from './context';
import type { OptionProps } from './types';

import css from './Option.css';

export function Option(props: Readonly<OptionProps>) {
  const context = useContext(SelectContext);

  const active = createMemo(() => props.value === context.value);

  return (
    <li
      data-value={props.value}
      class={join(css.root, props.class)}
      classList={{
        [css.active!]: active(),
        [css.disabled!]: props.disabled,
      }}
      onClick={() => context.onChange?.(props.value)}
    >
      <span class={css.content}>{props.children}</span>
      <Show when={active()}>
        <Icon size="sm" name="confirm" class={css.icon} />
      </Show>
    </li>
  );
}
