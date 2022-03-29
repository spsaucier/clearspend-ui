import type { JSXElement } from 'solid-js';

import { join } from '_common/utils/join';

import css from './WidgetCard.css';

interface WidgetCardProps {
  title: JSXElement;
  children: JSXElement;
  class?: string;
}

export function WidgetCard(props: Readonly<WidgetCardProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <h4 class={css.title}>{props.title}</h4>
      {props.children}
    </div>
  );
}
