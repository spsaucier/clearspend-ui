import type { JSX } from 'solid-js/jsx-runtime';

import logo from 'app/assets/logo-light.svg';

import css from './PagePreAuth.css';

interface PagePreAuthProps {
  children: JSX.Element;
}

export const PagePreAuth = (props: PagePreAuthProps) => (
  <section class={css.root}>
    <header class={css.header}>
      <img src={logo} alt="Company logo" width={120} height={34} />
    </header>
    <div class={css.content}>{props.children}</div>
  </section>
);
