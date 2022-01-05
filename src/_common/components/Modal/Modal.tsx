import { JSXElement, Show } from 'solid-js';

import css from './Modal.css';

export function Modal(props: Readonly<{ children: JSXElement; isOpen: boolean; close: () => void }>) {
  return (
    <Show when={props.isOpen}>
      <div class={css.modal} onClick={props.close}>
        {props.children}
      </div>
    </Show>
  );
}
