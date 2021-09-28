import { JSX, mergeProps, createSignal, createMemo, createEffect, onCleanup } from 'solid-js';
import { Show, Portal } from 'solid-js/web';

import { join } from '_common/utils/join';

import { calcDialogStyle } from './utils';
import type { VPos, HPos, PopoverPosition, FuncProps } from './types';

import css from './Popover.css';

const SHOW_DELAY = 300;
const CLOSE_DELAY = 150;

function getPosStyle(position: [VPos, HPos]) {
  const [vPos, hPos] = position;

  return join(
    vPos === 'top' && css.top,
    vPos === 'bottom' && css.bottom,
    hPos === 'left' && css.left,
    hPos === 'center' && css.center,
    hPos === 'right' && css.right,
  );
}

export interface PopoverProps {
  open?: boolean;
  trigger?: 'click' | 'hover';
  balloon?: boolean;
  position?: PopoverPosition;
  content: JSX.Element;
  class?: string;
  onClickOutside?: () => void;
  children: ((props: FuncProps) => JSX.Element) | JSX.Element;
}

export function Popover(props: Readonly<PopoverProps>) {
  let trigger: Element;
  let dialog: HTMLDivElement;
  let timeout: number;

  const merged = mergeProps({ trigger: 'click', position: 'bottom-left' }, props);
  const position = createMemo(() => merged.position.split('-') as [VPos, HPos]);

  const [open, setOpen] = createSignal(false);
  const onClick = () => setOpen((prev) => !prev);
  const opened = createMemo(() => open() || Boolean(merged.open));

  const onMouseEnter = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => setOpen(true), SHOW_DELAY);
  };

  const onMouseLeave = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  const onDocClick = (event: MouseEvent) => {
    if (!dialog.contains(event.target as Node) && !trigger.contains(event.target as Node)) {
      setOpen(false);
      merged.onClickOutside?.();
    }
  };

  createEffect(() => {
    opened() && merged.trigger === 'click'
      ? document.body.addEventListener('click', onDocClick)
      : document.body.removeEventListener('click', onDocClick);
  });

  onCleanup(() => document.body.removeEventListener('click', onDocClick));

  trigger = (
    typeof merged.children === 'function'
      ? merged.children({
          ...(merged.trigger === 'click' && { onClick }),
          ...(merged.trigger === 'hover' && { onMouseEnter, onMouseLeave }),
        })
      : merged.children
  ) as Element;

  return (
    <>
      {trigger}
      <Show when={opened()}>
        <Portal>
          <div class={css.root} style={calcDialogStyle(merged.position, trigger)}>
            <div
              role="dialog"
              ref={(el) => {
                dialog = el;
              }}
              class={join(css.popover, merged.balloon && css.balloon, getPosStyle(position()), merged.class)}
            >
              {merged.content}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
