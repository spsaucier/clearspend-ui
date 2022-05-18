import { JSXElement, Show } from 'solid-js';

import css from './Tag.css';

export interface TagProps {
  label?: string;
  type?: 'default' | 'secondary' | 'primary' | 'success' | 'danger' | 'warning';
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
      class={css.root}
      classList={{
        [props.class!]: !!props.class,
        [css.sm!]: props.size === 'sm',
        [css.xs!]: props.size === 'xs',
        [css.secondary!]: props.type === 'secondary',
        [css.primary!]: props.type === 'primary',
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
