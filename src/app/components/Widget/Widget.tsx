import { JSXElement, Show } from 'solid-js';

import { join } from '_common/utils/join';

import css from './Widget.css';

interface WidgetProps {
  title: JSXElement;
  extra?: JSXElement;
  sub?: JSXElement;
  class?: string;
  children: JSXElement;
}

export function Widget(props: Readonly<WidgetProps>) {
  return (
    <section class={join(css.root, props.class)}>
      <header class={css.header}>
        <div class={css.titleWrap}>
          <h3 class={css.title}>{props.title}</h3>
          {props.extra}
        </div>
        <Show when={props.sub}>
          <div class={css.sub}>{props.sub}</div>
        </Show>
      </header>
      <div>{props.children}</div>
    </section>
  );
}
