import { type JSXElement, Show } from 'solid-js';

import { join } from '_common/utils/join';

import css from './Section.css';

interface SectionProps {
  id?: Lowercase<string>;
  title?: JSXElement;
  description?: JSXElement;
  class?: string;
  contentClass?: string;
  children: JSXElement;
}

export function Section(props: Readonly<SectionProps>) {
  return (
    <section id={props.id} class={join(css.root, props.class)}>
      <header class={css.header}>
        <Show when={props.title}>
          <h3 class={css.title}>{props.title}</h3>
        </Show>
        <Show when={props.description}>
          <div class={css.description}>{props.description}</div>
        </Show>
      </header>
      <div class={join(css.content, props.contentClass)}>{props.children}</div>
    </section>
  );
}
