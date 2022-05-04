import { createMemo, Show, type JSXElement } from 'solid-js';
import { NavLink } from 'solid-app-router';

import { join } from '_common/utils/join';

import css from './Link.css';

const isNavLink = (href: string) => Boolean(href.match(/^\//));
const isOutsideLink = (href: string) => Boolean(href.match(/^http/));

interface LinkProps {
  href: string;
  class?: string;
  darkMode?: boolean;
  onClick?: (event: MouseEvent) => void;
  children: JSXElement;
}

export function Link(props: Readonly<LinkProps>) {
  const cls = createMemo(() => join(css.root, props.darkMode && css.dark, props.class));

  return (
    <Show
      when={isNavLink(props.href)}
      fallback={
        <a
          href={props.href}
          class={cls()}
          {...(isOutsideLink(props.href) && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          onClick={props.onClick}
        >
          {props.children}
        </a>
      }
    >
      <NavLink href={props.href} class={cls()} onClick={props.onClick}>
        {props.children}
      </NavLink>
    </Show>
  );
}
