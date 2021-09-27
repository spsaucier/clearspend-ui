import { mergeProps } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';

import css from './Button.css';

export interface ButtonProps {
  class?: string;
  loading?: boolean; // TODO
  disabled?: boolean;
  htmlType?: 'button' | 'submit';
  children?: JSX.Element;
  onClick?: () => void;
}

export function Button(props: Readonly<ButtonProps>) {
  const merged = mergeProps({ htmlType: 'button' }, props);

  return (
    <button
      type={merged.htmlType}
      disabled={merged.disabled}
      class={join(css.root, merged.class)}
      onClick={merged.onClick}
    >
      {props.children}
    </button>
  );
}
