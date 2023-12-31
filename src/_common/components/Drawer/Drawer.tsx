import { createMemo, type JSXElement } from 'solid-js';
import { Show, Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';

import { useDisableBodyScroll } from '_common/utils/useDisableBodyScroll';

import { Button } from '../Button';

import css from './Drawer.css';

export interface DrawerProps {
  open: boolean;
  noPadding?: boolean;
  title: JSXElement;
  darkMode?: boolean;
  children: JSXElement;
  onClose: () => void;
}

export function Drawer(props: Readonly<DrawerProps>) {
  useDisableBodyScroll(createMemo(() => props.open));

  return (
    <Portal>
      <Transition enterToClass={css.enter} exitToClass={css.exit}>
        <Show when={props.open}>
          <div class={css.root}>
            <button class={css.overlay} onClick={() => props.onClose()} />
            <section class={css.section}>
              <header class={css.header}>
                <h3 class={css.title}>{props.title}</h3>
                <Button view="ghost" size="sm" icon="cancel" class={css.close} onClick={() => props.onClose()} />
              </header>
              <div class={css.content} classList={{ [css.dark!]: props.darkMode, [css.noPadding!]: props.noPadding }}>
                {props.children}
              </div>
            </section>
          </div>
        </Show>
      </Transition>
    </Portal>
  );
}
