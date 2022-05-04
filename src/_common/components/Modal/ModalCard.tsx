import { Show, type JSXElement } from 'solid-js';

import { Icon } from '../Icon';

import css from './ModalCard.css';

interface ModalCardProps {
  title: JSXElement;
  actions?: JSXElement;
  children: JSXElement;
  onClose?: () => void;
}

export function ModalCard(props: Readonly<ModalCardProps>) {
  return (
    <div class={css.root}>
      <Show when={props.onClose}>
        <span class={css.close} onClick={() => props.onClose!()}>
          <Icon name="cancel" />
        </span>
      </Show>
      <h3 class={css.title}>{props.title}</h3>
      <div>{props.children}</div>
      <Show when={props.actions}>
        <div class={css.actions}>{props.actions}</div>
      </Show>
    </div>
  );
}
