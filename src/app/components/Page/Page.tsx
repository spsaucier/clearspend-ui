import { JSXElement, onMount } from 'solid-js';

import { join } from '_common/utils/join';

import css from './Page.css';

interface PageProps {
  title: JSXElement;
  extra?: JSXElement;
  actions?: JSXElement;
  stickyHeader?: boolean;
  class?: string;
  contentClass?: string;
  children: JSXElement;
}

export function Page(props: Readonly<PageProps>) {
  onMount(() => window.scrollTo(0, 0));

  return (
    <div class={join(css.root, props.class)}>
      <header class={css.header} classList={{ [css.stickyHeader!]: props.stickyHeader }}>
        <div class={css.headerMain}>
          <div class={css.titleWrap}>
            <h1 class={css.title}>{props.title}</h1>
            {props.extra}
          </div>
          {props.actions}
        </div>
      </header>
      <div class={join(css.content, props.contentClass)}>{props.children}</div>
    </div>
  );
}
