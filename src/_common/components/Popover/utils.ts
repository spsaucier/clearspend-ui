import type { JSX } from 'solid-js';

import { keys } from '../../utils/keys';

import type { VPos, HPos, PopoverPosition, UncontrolledProps } from './types';

const HALF = 2;

interface ElementRect {
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function getPosParts(pos: PopoverPosition): [VPos, HPos] {
  return pos.split('-') as [VPos, HPos];
}

function getRect(element: Element): ElementRect {
  const rect = element.getBoundingClientRect().toJSON() as DOMRect;
  return { ...rect, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
}

function toPX(obj: Readonly<Record<string, number>>): JSX.CSSProperties {
  return keys(obj).reduce<JSX.CSSProperties>((acc, prop) => {
    acc[prop] = `${obj[prop]}px`;
    return acc;
  }, {});
}

export function fixPosition(pos: PopoverPosition, trigger: Element, dialog: Element): PopoverPosition {
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  let [vPos, hPos] = getPosParts(pos);

  const elRect = trigger.getBoundingClientRect();
  const popRect = dialog.getBoundingClientRect();

  if (vPos === 'top' && popRect.top < 0 && elRect.bottom + popRect.height <= winH) vPos = 'bottom';
  else if (vPos === 'bottom' && popRect.bottom > winH && elRect.top - popRect.height >= 0) vPos = 'top';

  if (hPos === 'left' && popRect.right > winW) {
    if (elRect.left + elRect.width / HALF + popRect.width / HALF <= winW) hPos = 'center';
    else if (elRect.right <= winW) hPos = 'right';
  } else if (hPos === 'center' && popRect.left < 0 && elRect.left >= 0) hPos = 'left';
  else if (hPos === 'center' && popRect.right > winW && elRect.right <= winW) hPos = 'right';
  // TODO right ?

  return `${vPos}-${hPos}`;
}

export function calcDialogStyle(pos: PopoverPosition, el?: Element): JSX.CSSProperties {
  if (!el) return {};

  const [vPos] = getPosParts(pos);
  const { top, bottom, left, width } = getRect(el);

  return vPos === 'top' ? toPX({ top, left, width }) : toPX({ top: bottom, left, width });
}

export function getHoverProps(
  props: Required<Pick<UncontrolledProps, 'enterDelay' | 'leaveDelay'>>,
  setOpen: (open: boolean) => void,
) {
  let timeout: number;

  const onMouseEnter = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => setOpen(true), props.enterDelay);
  };

  const onMouseLeave = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => setOpen(false), props.leaveDelay);
  };

  return { onMouseEnter, onMouseLeave };
}
