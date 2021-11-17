import { JSXElement, onMount, Show } from 'solid-js';

import { join } from '_common/utils/join';

import { PageContext, IPageContext } from './context';

import css from './Page.css';

interface PageProps {
  title: JSXElement;
  titleClass?: string;
  side?: JSXElement;
  breadcrumb?: JSXElement;
  extra?: JSXElement;
  actions?: JSXElement;
  stickyHeader?: boolean;
  class?: string;
  contentClass?: string;
  children: JSXElement;
}

export function Page(props: Readonly<PageProps>) {
  const context: IPageContext = { current: undefined };

  onMount(() => window.scrollTo(0, 0));

  return (
    <div class={join(css.root, props.class)}>
      <Show when={props.side}>
        <div class={css.side}>{props.side}</div>
      </Show>
      <div class={css.wrapper}>
        <header class={css.header} classList={{ [css.stickyHeader!]: props.stickyHeader }}>
          <Show when={props.breadcrumb}>
            <div class={css.breadcrumb}>{props.breadcrumb}</div>
          </Show>
          <div class={css.headerMain}>
            <div class={css.titleWrap}>
              <h1 class={join(css.title, props.titleClass)}>{props.title}</h1>
              {props.extra}
            </div>
            {props.actions}
          </div>
        </header>
        <div
          class={css.footer}
          ref={(el) => {
            context.current = el;
          }}
        />
        <div class={join(css.content, props.contentClass)}>
          <PageContext.Provider value={context}>{props.children}</PageContext.Provider>
        </div>
      </div>
    </div>
  );
}
