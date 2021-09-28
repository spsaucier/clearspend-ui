import { mergeProps } from 'solid-js';
import type { JSXElement } from 'solid-js';

import { Popover, PopoverPosition, PopoverFuncProps } from '../Popover';
import { join } from '../../utils/join';

import css from './Tooltip.css';

export type TooltipFuncProps = PopoverFuncProps;

export interface TooltipProps {
  message: JSXElement;
  position?: PopoverPosition;
  class?: string;
  children: (props: TooltipFuncProps) => JSXElement;
}

export function Tooltip(props: Readonly<TooltipProps>) {
  const merged = mergeProps({ position: 'top-center' }, props);

  return (
    <Popover
      balloon
      trigger="hover"
      enterDelay={350}
      leaveDelay={0}
      position={merged.position}
      content={merged.message}
      class={join(css.root, merged.class)}
    >
      {merged.children}
    </Popover>
  );
}
