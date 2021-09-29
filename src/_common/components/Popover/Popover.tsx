import { mergeProps, createSignal, createMemo, createEffect, onCleanup } from 'solid-js';
import { Show, Portal } from 'solid-js/web';

import { join } from '_common/utils/join';

import { calcDialogStyle, getHoverProps } from './utils';
import type { VPos, HPos, ControlledProps, PopoverProps } from './types';

import css from './Popover.css';

const DEFAULT_PROPS = {
  trigger: 'click',
  position: 'bottom-left',
  enterDelay: 300,
  leaveDelay: 150,
};

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

export function Popover(props: Readonly<PopoverProps>) {
  let trigger: Element;
  let dialog: HTMLDivElement;

  const merged = mergeProps(DEFAULT_PROPS, props);

  if ('open' in merged && typeof merged.children === 'function')
    throw new Error('Function cannot be used as children in controlled component');

  const position = createMemo(() => merged.position.split('-') as [VPos, HPos]);

  const [open, setOpen] = createSignal(false);
  const onClick = () => setOpen((prev) => !prev);
  const opened = createMemo(() => ('open' in merged ? merged.open : open()));

  const onClickOutside = (event: MouseEvent) => {
    if (!dialog.contains(event.target as Node) && !trigger.contains(event.target as Node)) {
      (merged as ControlledProps).onClickOutside?.();
      setOpen(false);
    }
  };

  createEffect(() => {
    opened() && merged.trigger === 'click'
      ? document.body.addEventListener('click', onClickOutside)
      : document.body.removeEventListener('click', onClickOutside);
  });

  onCleanup(() => document.body.removeEventListener('click', onClickOutside));

  trigger = (
    typeof merged.children === 'function'
      ? merged.children({
          ...(merged.trigger === 'click' && { onClick }),
          ...(merged.trigger === 'hover' && getHoverProps(merged, setOpen)),
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
