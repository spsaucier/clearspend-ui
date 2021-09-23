import type { Component } from 'solid-js';

import css from './Button.css';

export interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: Component<Readonly<ButtonProps>> = (props) => {
  return (
    <button
      type="button"
      disabled={props.disabled}
      class={css.root}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
