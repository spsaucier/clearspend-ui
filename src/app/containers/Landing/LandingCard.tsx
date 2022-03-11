import { Show, type JSXElement } from 'solid-js';

import { join } from '_common/utils/join';

import css from './LandingCard.css';

interface LandingCardProps {
  title: JSXElement;
  actions?: JSXElement;
  class?: string;
  children: JSXElement;
}

export function LandingCard(props: Readonly<LandingCardProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <h3 class={css.title}>{props.title}</h3>
      <div class={css.content}>{props.children}</div>
      <Show when={props.actions}>
        <div class={css.actions}>{props.actions}</div>
      </Show>
    </div>
  );
}
