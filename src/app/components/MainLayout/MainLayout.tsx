import type { JSXElement } from 'solid-js';

import { join } from '_common/utils/join';

import css from './MainLayout.css';

interface MainLayoutProps {
  side: JSXElement;
  darkSide?: boolean;
  children: JSXElement;
}

export function MainLayout(props: Readonly<MainLayoutProps>) {
  return (
    <div class={css.root}>
      <aside class={join(css.side, props.darkSide ? css.darkSide : '')}>{props.side}</aside>
      <main class={css.content}>{props.children}</main>
    </div>
  );
}
