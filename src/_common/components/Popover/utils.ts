import type { JSX } from 'solid-js';

import { keys } from '../../utils/keys';
import { callValue } from '../../utils/callValue';

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
  const rect = callValue(element).getBoundingClientRect().toJSON() as DOMRect;
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
  if (vPos === 'middle') return pos;

  const elRect = callValue(trigger).getBoundingClientRect();
  const popRect = dialog.getBoundingClientRect();

  if (vPos === 'top' && popRect.top < 0 && elRect.bottom + popRect.height <= winH) vPos = 'bottom';
  else if (vPos === 'bottom' && popRect.bottom > winH && elRect.top - popRect.height >= 0) vPos = 'top';

  if (hPos === 'left' && popRect.right > winW) {
    if (elRect.left + elRect.width / HALF + popRect.width / HALF <= winW) hPos = 'center';
    else if (elRect.right <= winW) hPos = 'right';
  } else if (hPos === 'center' && popRect.left < 0 && elRect.left >= 0) hPos = 'left';
  else if (hPos === 'center' && popRect.right > winW && elRect.right <= winW) hPos = 'right';
  else if (hPos === 'right' && popRect.left < 0) {
    if (elRect.left + elRect.width / HALF - popRect.width / HALF >= 0) hPos = 'center';
    else if (elRect.left + popRect.width <= winW) hPos = 'left';
  }

  return `${vPos}-${hPos}` as PopoverPosition;
}

export function calcDialogStyle(pos: PopoverPosition, el?: Element): JSX.CSSProperties {
  if (!el) return {};

  const [vPos, hPos] = getPosParts(pos);
  const { top, bottom, left, right, width, height } = getRect(el);

  if (vPos === 'top') return toPX({ top, left, width });
  if (vPos === 'middle' && hPos === 'left') return toPX({ top, left, height });
  if (vPos === 'middle' && hPos === 'right') return toPX({ top, left: right, height });

  return toPX({ top: bottom, left, width });
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
