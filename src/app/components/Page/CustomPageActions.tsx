import type { JSXElement } from 'solid-js';

import { PagePortal } from './PagePortal';

import css from './PageActions.css';

interface CustomPageActionsProps {
  children?: JSXElement;
}

export function CustomPageActions(props: Readonly<CustomPageActionsProps>) {
  return (
    <PagePortal>
      <div class={css.root}>
        <div class={css.actions}>{props.children}</div>
      </div>
    </PagePortal>
  );
}
