import type { JSXElement } from 'solid-js';

import { join } from '../../utils/join';

import { useTabsContext } from './context';

import css from './Tab.css';

interface TabProps<T = string> {
  value: T;
  class?: string;
  children: JSXElement;
}

export function Tab<T = string>(props: Readonly<TabProps<T>>) {
  const context = useTabsContext<T>();

  const onClick = () => context.onChange?.(props.value);

  return (
    <button
      class={join(css.root, props.class)}
      classList={{ [css.active!]: context.value === props.value }}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
}
