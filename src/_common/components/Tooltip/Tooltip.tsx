import { mergeProps } from 'solid-js';
import type { JSXElement } from 'solid-js';

import { Popover, PopoverPosition, PopoverFuncProps } from '../Popover';
import { join } from '../../utils/join';

import css from './Tooltip.css';

export type TooltipFuncProps = PopoverFuncProps;

export const DEFAULT_ENTER_DELAY = 500;
export const DEFAULT_LEAVE_DELAY = 0;

export interface TooltipProps {
  message: JSXElement;
  position?: PopoverPosition;
  disabled?: boolean;
  class?: string;
  enterDelay?: number;
  leaveDelay?: number;
  children: (props: TooltipFuncProps) => JSXElement;
}

export function Tooltip(props: Readonly<TooltipProps>) {
  const merged = mergeProps(
    { position: 'top-center', enterDelay: DEFAULT_ENTER_DELAY, leaveDelay: DEFAULT_LEAVE_DELAY },
    props,
  );

  return (
    <Popover
      balloon
      trigger="hover"
      enterDelay={merged.enterDelay}
      leaveDelay={merged.leaveDelay}
      position={merged.position}
      content={merged.message}
      disabled={merged.disabled}
      class={join(css.root, merged.class)}
      caretClass={css.caret}
    >
      {merged.children}
    </Popover>
  );
}
