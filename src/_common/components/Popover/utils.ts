import type { JSX } from 'solid-js';

import { keys } from '../../utils/keys';

import type { PopoverPosition, UncontrolledProps } from './types';

interface ElementRect {
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
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

export function calcDialogStyle(pos: PopoverPosition, el?: Element): JSX.CSSProperties {
  if (!el) return {};
  const { top, bottom, left, width } = getRect(el);

  switch (pos) {
    case 'top-left':
    case 'top-center':
    case 'top-right':
      return toPX({ top, left, width });
    case 'bottom-left':
    case 'bottom-center':
    case 'bottom-right':
    default:
      return toPX({ top: bottom, left, width });
  }
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
