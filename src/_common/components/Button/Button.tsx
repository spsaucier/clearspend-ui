import { mergeProps } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';

import css from './Button.css';

export interface ButtonProps {
  type?: 'default' | 'primary' | 'positive' | 'danger' | 'ghost'; // TODO
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  loading?: boolean; // TODO
  disabled?: boolean;
  htmlType?: 'button' | 'submit';
  children?: JSX.Element;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Button(props: Readonly<ButtonProps>) {
  const merged = mergeProps({ type: 'default', size: 'md', htmlType: 'button' }, props);

  return (
    <button
      type={merged.htmlType}
      disabled={merged.disabled}
      class={join(css.root, merged.class)}
      onClick={merged.onClick}
      onMouseEnter={merged.onMouseEnter}
      onMouseLeave={merged.onMouseLeave}
    >
      {props.children}
    </button>
  );
}
