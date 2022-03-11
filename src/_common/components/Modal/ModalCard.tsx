import { Show, type JSXElement } from 'solid-js';

import css from './ModalCard.css';

interface ModalCardProps {
  title: JSXElement;
  actions?: JSXElement;
  children: JSXElement;
}

export function ModalCard(props: Readonly<ModalCardProps>) {
  return (
    <div class={css.root}>
      <h3 class={css.title}>{props.title}</h3>
      <div>{props.children}</div>
      <Show when={props.actions}>
        <div class={css.actions}>{props.actions}</div>
      </Show>
    </div>
  );
}
