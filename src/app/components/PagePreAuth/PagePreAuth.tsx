import { createMemo, Show, type JSXElement } from 'solid-js';

import logo from 'app/assets/Logo_Tagline_White.png';

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
          <img src={logo} alt="Company logo" width={200} height={70} />
        </header>
        <div class={css.content}>{props.children}</div>
      </div>
      <Show when={side()}>
        <div class={css.side}>{side()}</div>
      </Show>
    </div>
  );
}
