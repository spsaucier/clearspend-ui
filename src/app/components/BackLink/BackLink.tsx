import type { JSXElement } from 'solid-js';
import { NavLink } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { join } from '_common/utils/join';

import css from './BackLink.css';

interface BackLinkProps {
  to: string;
  class?: string;
  children: JSXElement;
}

export function BackLink(props: Readonly<BackLinkProps>) {
  return (
    <NavLink href={props.to} class={join(css.root, props.class)}>
      <Icon name="arrow-left" size="sm" class={css.icon} />
      {props.children}
    </NavLink>
  );
}
