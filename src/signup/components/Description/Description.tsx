import type { JSXElement } from 'solid-js';

import { join } from '_common/utils/join';

import css from './Description.css';

interface DescriptionProps {
  class?: string;
  children: JSXElement;
}

export function Description(props: Readonly<DescriptionProps>) {
  return <p class={join(css.root, props.class)}>{props.children}</p>;
}
