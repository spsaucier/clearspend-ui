import type { JSXElement } from 'solid-js';

import css from './Empty.css';

interface EmptyProps {
  message: JSXElement;
}

export function Empty(props: Readonly<EmptyProps>) {
  return <div class={css.root}>{props.message}</div>;
}
