import type { JSXElement } from 'solid-js';

import css from './FilterBox.css';

interface FilterBoxProps {
  title: JSXElement;
  children: JSXElement;
}

export function FilterBox(props: Readonly<FilterBoxProps>) {
  return (
    <div class={css.root}>
      <h4 class={css.title}>{props.title}</h4>
      <div>{props.children}</div>
    </div>
  );
}
