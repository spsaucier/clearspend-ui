import type { JSXElement } from 'solid-js';

import css from './Header.css';

interface HeaderProps {
  children: JSXElement;
}

export function Header(props: Readonly<HeaderProps>) {
  return <h3 class={css.root}>{props.children}</h3>;
}
