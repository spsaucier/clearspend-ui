import type { JSXElement } from 'solid-js';

import css from './MainLayout.css';

interface MainLayoutProps {
  side: JSXElement;
  children: JSXElement;
}

export function MainLayout(props: Readonly<MainLayoutProps>) {
  return (
    <div class={css.root}>
      <aside class={css.side}>{props.side}</aside>
      <main class={css.content}>{props.children}</main>
    </div>
  );
}
