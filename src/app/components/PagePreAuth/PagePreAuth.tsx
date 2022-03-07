import { createMemo, Show, type JSXElement } from 'solid-js';

import logo from 'app/assets/logo-light.svg';

import css from './PagePreAuth.css';

interface PagePreAuthProps {
  side?: JSXElement;
  children: JSXElement;
}

export function PagePreAuth(props: Readonly<PagePreAuthProps>) {
  const side = createMemo(() => props.side);

  return (
    <div class={css.root}>
      <div class={css.main}>
        <header class={css.header}>
          <img src={logo} alt="Company logo" width={120} height={34} />
        </header>
        <div class={css.content}>{props.children}</div>
      </div>
      <Show when={side()}>
        <div class={css.side}>{side()}</div>
      </Show>
    </div>
  );
}
