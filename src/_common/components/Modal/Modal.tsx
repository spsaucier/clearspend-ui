import { JSXElement, createMemo, Show } from 'solid-js';

import { useDisableBodyScroll } from '_common/utils/useDisableBodyScroll';

import css from './Modal.css';

type ModalProps = Readonly<{
  children: JSXElement;
  isOpen: boolean;
  onClose?: () => void;
}>;

export function Modal(props: ModalProps) {
  useDisableBodyScroll(createMemo(() => props.isOpen));

  return (
    <Show when={props.isOpen}>
      <div class={css.modal}>
        <div class={css.overlay} onClick={() => props.onClose?.()} />
        {props.children}
      </div>
    </Show>
  );
}
