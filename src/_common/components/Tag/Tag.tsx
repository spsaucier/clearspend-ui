import { JSXElement, Show } from 'solid-js';

import { join } from '../../utils/join';

import css from './Tag.css';

export interface TagProps {
  label?: string;
  type?: 'default' | 'success' | 'danger';
  size?: 'md' | 'sm' | 'xs';
  class?: string;
  children?: JSXElement;
}

export function Tag(props: Readonly<TagProps>) {
  return (
    <span
      class={join(css.root, props.class)}
      classList={{
        [css.sm!]: props.size === 'sm',
        [css.xs!]: props.size === 'xs',
        [css.success!]: props.type === 'success',
        [css.danger!]: props.type === 'danger',
      }}
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
