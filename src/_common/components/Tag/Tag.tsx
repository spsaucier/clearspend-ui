import { JSXElement, Show } from 'solid-js';

import { join } from '../../utils/join';

import css from './Tag.css';

export interface TagProps {
  label?: string;
  type?: 'default' | 'success' | 'danger' | 'warning';
  size?: 'md' | 'sm' | 'xs';
  class?: string;
  tabIndex?: number | string;
  children?: JSXElement;
  onClick?: (event: MouseEvent) => void;
}

export function Tag(props: Readonly<TagProps>) {
  return (
    <span
      tabIndex={props.tabIndex}
      class={join(css.root, props.class)}
      classList={{
        [css.sm!]: props.size === 'sm',
        [css.xs!]: props.size === 'xs',
        [css.success!]: props.type === 'success',
        [css.danger!]: props.type === 'danger',
        [css.warning!]: props.type === 'warning',
      }}
      onClick={props.onClick}
    >
      <Show when={props.label}>
        <span class={css.label}>
          {props.label}
          {props.children ? ':' : ''}
        </span>
      </Show>
      <Show when={props.children}>
        <span class={css.child}>{props.children}</span>
      </Show>
    </span>
  );
}
