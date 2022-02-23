import type { JSXElement } from 'solid-js';

import css from './Header.css';

interface HeaderProps {
  children: JSXElement;
  size?: 'large' | 'small';
}

export function Header(props: Readonly<HeaderProps>) {
  return (
    <h3
      class={css.root}
      classList={{
        [css.small!]: props.size === 'small',
        [css.large!]: props.size === 'large',
      }}
    >
      {props.children}
    </h3>
  );
}
