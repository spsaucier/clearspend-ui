import type { JSXElement } from 'solid-js';

import { Icon } from '../Icon';

import css from './AddButton.css';

interface AddButtonProps {
  id?: string;
  class?: string;
  children: JSXElement;
  onClick: (event: MouseEvent) => void;
}

export function AddButton(props: Readonly<AddButtonProps>) {
  return (
    <button id={props.id} class={css.root} classList={{ [props.class!]: !!props.class }} onClick={props.onClick}>
      <Icon name="add-circle-outline" size="sm" class={css.icon} />
      {props.children}
    </button>
  );
}
