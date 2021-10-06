import { useContext } from 'solid-js';

import { join } from '../../utils/join';

import { SelectContext } from './context';
import type { OptionProps } from './types';

import css from './Option.css';

export function Option(props: Readonly<OptionProps>) {
  const context = useContext(SelectContext);

  return (
    <li
      data-value={props.value}
      class={join(css.root, props.class)}
      classList={{
        [css.active!]: props.value === context.value,
        [css.disabled!]: props.disabled,
      }}
      onClick={() => context.onChange?.(props.value)}
    >
      {props.children}
    </li>
  );
}
