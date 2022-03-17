import { JSXElement, onCleanup, Show } from 'solid-js';

import { getNoop } from '_common/utils/getNoop';
import { useDeferEffect } from '_common/utils/useDeferEffect';

import css from './Modal.css';

type ModalProps = Readonly<{
  children: JSXElement;
  isOpen: boolean;
  close?: () => void;
}>;

export function Modal(props: ModalProps) {
  const body = document.body;

  const onOpen = () => {
    const width = body.clientWidth;
    body.style.overflow = 'hidden';
    body.style.width = `${width}px`;
  };

  const onClose = () => {
    body.style.overflow = '';
    body.style.width = '';
  };

  useDeferEffect(
    (open) => (open ? onOpen() : onClose()),
    () => props.isOpen,
  );
  onCleanup(() => onClose());

  if (props.isOpen) onOpen();
  return (
    <Show when={props.isOpen}>
      <div class={css.modal}>
        <div class={css.overlay} onClick={props.close || getNoop} />
        {props.children}
      </div>
    </Show>
  );
}
