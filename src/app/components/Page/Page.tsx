import { JSXElement, onMount, Show } from 'solid-js';

import { join } from '_common/utils/join';
import { callValue } from '_common/utils/callValue';

import { PageContext, IPageContext } from './context';

import css from './Page.css';

function isExist(child?: JSXElement): boolean {
  return Boolean(callValue(child));
}

interface PageProps {
  title: JSXElement;
  titleClass?: string;
  subtitle?: JSXElement;
  side?: JSXElement;
  headerSide?: JSXElement;
  breadcrumbs?: JSXElement;
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
          <Show when={props.breadcrumbs}>
            <div class={css.breadcrumbs}>{props.breadcrumbs}</div>
          </Show>
          <div classList={{ [css.headerSideWrapper!]: isExist(props.headerSide) }}>
            <Show when={props.headerSide}>
              <div>{props.headerSide}</div>
            </Show>
            <div>
              <div class={css.headerMain}>
                <div class={css.titleWrap}>
                  <h1 class={join(css.title, props.titleClass)}>{props.title}</h1>
                  {props.extra}
                </div>
                {props.actions}
              </div>
              <Show when={props.subtitle}>
                <div class={css.subtitle}>{props.subtitle}</div>
              </Show>
            </div>
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
