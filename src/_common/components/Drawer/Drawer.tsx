import type { JSXElement } from 'solid-js';
import { Show, Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';

import { Button } from '../Button';

import css from './Drawer.css';

interface DrawerProps {
  open: boolean;
  noPadding?: boolean;
  title: JSXElement;
  children: JSXElement;
  onClose: () => void;
}

export function Drawer(props: Readonly<DrawerProps>) {
  return (
    <Portal>
      <Transition enterToClass={css.enter} exitToClass={css.exit}>
        <Show when={props.open}>
          <div class={css.root}>
            <button class={css.overlay} onClick={props.onClose} />
            <section class={css.section}>
              <header class={css.header}>
                <h3 class={css.title}>{props.title}</h3>
                <Button view="ghost" size="sm" icon="cancel" onClick={props.onClose} />
              </header>
              <div class={css.content} classList={{ [css.noPadding!]: props.noPadding }}>
                {props.children}
              </div>
            </section>
          </div>
        </Show>
      </Transition>
    </Portal>
  );
}
