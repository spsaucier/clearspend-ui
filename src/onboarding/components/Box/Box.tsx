import type { JSXElement } from 'solid-js';

import css from './Box.css';

interface BoxProps {
  children: JSXElement;
}

export function Box(props: Readonly<BoxProps>) {
  return <div class={css.root}>{props.children}</div>;
}
