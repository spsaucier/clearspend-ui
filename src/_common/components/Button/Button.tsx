import type { JSX } from 'solid-js';

import css from './Button.css';

export interface ButtonProps {
  disabled?: boolean;
  children?: JSX.Element;
  onClick?: () => void;
}

export function Button(props: Readonly<ButtonProps>) {
  return (
    <button type="button" disabled={props.disabled} class={css.root} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
