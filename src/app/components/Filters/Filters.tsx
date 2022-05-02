import type { JSXElement } from 'solid-js';

import css from './Filters.css';

interface FiltersProps {
  side: JSXElement;
  children?: JSXElement;
}

export function Filters(props: Readonly<FiltersProps>) {
  return (
    <div class={css.root}>
      <div class={css.main}>{props.children}</div>
      <div>{props.side}</div>
    </div>
  );
}
