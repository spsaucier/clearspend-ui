import type { Component } from "solid-js";

export interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: Component<Readonly<ButtonProps>> = (props) => {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
