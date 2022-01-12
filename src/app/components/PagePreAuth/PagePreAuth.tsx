import type { JSX } from 'solid-js/jsx-runtime';

import { Box } from 'signup/components/Box';

import logo from '../../assets/logo-name.svg';

import css from './PagePreAuth.css';

interface PagePreAuthProps {
  children: JSX.Element;
}

export const PagePreAuth = (props: PagePreAuthProps) => (
  <section class={css.root}>
    <header class={css.header}>
      <img src={logo} alt="Company logo" width={120} height={34} />
    </header>
    <div class={css.content}>
      <Box>{props.children}</Box>
    </div>
  </section>
);
