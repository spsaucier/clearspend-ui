import { mergeProps, createSignal, createMemo, createEffect, onCleanup, untrack } from 'solid-js';
import { Show, Portal } from 'solid-js/web';

import { join } from '_common/utils/join';
import { callValue } from '_common/utils/callValue';

import { getPosParts, fixPosition, calcDialogStyle, getHoverProps } from './utils';
import type { PopoverPosition, ControlledProps, PopoverProps } from './types';

import css from './Popover.css';

const DEFAULT_PROPS = {
  trigger: 'click',
  position: 'bottom-left',
  enterDelay: 300,
  leaveDelay: 150,
};

function getPosClass(pos: PopoverPosition) {
  const [vPos, hPos] = getPosParts(pos);

  return join(
    vPos === 'top' && css.top,
    vPos === 'bottom' && css.bottom,
    vPos !== 'middle' && hPos === 'left' && css.left,
    vPos !== 'middle' && hPos === 'center' && css.center,
    vPos !== 'middle' && hPos === 'right' && css.right,
    vPos === 'middle' && hPos === 'left' && css.middleLeft,
    vPos === 'middle' && hPos === 'right' && css.middleRight,
  );
}

export function Popover(props: Readonly<PopoverProps>) {
  let trigger: Element;
  let dialog!: HTMLDivElement;

  const merged = mergeProps(DEFAULT_PROPS, props);

  const [open, setOpen] = createSignal(false);
  const opened = createMemo(() => ('open' in merged ? merged.open : open()));

  const onOpen = (value: boolean) => !props.disabled && setOpen(value);
  const onClick = () => onOpen(!open());

  const [fixedPos, setFixedPos] = createSignal<PopoverPosition>();
  const pos = createMemo(() => fixedPos() || merged.position);

  const onClickOutside = (event: MouseEvent) => {
    if (!dialog.contains(event.target as Node) && !callValue(trigger).contains(event.target as Node)) {
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

  createEffect(() => {
    if (opened()) setFixedPos(fixPosition(merged.position, trigger, dialog));
    else if (untrack(fixedPos)) setFixedPos(undefined);
  });

  trigger = (
    typeof merged.children === 'function'
      ? merged.children({
          ...(merged.trigger === 'click' && { onClick }),
          ...(merged.trigger === 'hover' && getHoverProps(merged, onOpen)),
        })
      : merged.children
  ) as Element;

  return (
    <>
      {trigger}
      <Show when={opened()}>
        <Portal>
          <div
            class={join(css.root, merged.balloon && css.balloon, getPosClass(pos()))}
            style={calcDialogStyle(pos(), trigger)}
          >
            <div
              id={merged.id}
              role="dialog"
              ref={(el) => {
                dialog = el;
                if (typeof props.ref === 'function') props.ref(el);
              }}
              class={join(css.popover, merged.class)}
            >
              {merged.content}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
