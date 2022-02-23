import type { JSXElement } from 'solid-js';

import { join } from '_common/utils/join';

import css from './Description.css';

interface DescriptionProps {
  class?: string;
  children: JSXElement;
  size?: 'large' | 'small';
}

export function Description(props: Readonly<DescriptionProps>) {
  return (
    <p
      class={join(css.root, props.class)}
      classList={{
        [css.small!]: props.size === 'small',
        [css.large!]: props.size === 'large',
      }}
    >
      {props.children}
    </p>
  );
}
