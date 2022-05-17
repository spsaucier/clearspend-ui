import type { JSXElement } from 'solid-js';

export type VPos = 'top' | 'bottom' | 'middle';
export type HPos = 'left' | 'center' | 'right';

export type PopoverPosition = Exclude<`${VPos}-${HPos}`, 'middle-center'>;

export interface PopoverFuncProps {
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface BaseProps {
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  id?: string;
  balloon?: boolean;
  position?: PopoverPosition;
  content: JSXElement;
  disabled?: boolean;
  class?: string;
  caretClass?: string;
}

export interface ControlledProps extends BaseProps {
  open: boolean;
  onClickOutside?: () => void;
  children: JSXElement;
}

export interface UncontrolledProps extends BaseProps {
  trigger?: 'click' | 'hover';
  enterDelay?: number;
  leaveDelay?: number;
  children: (props: PopoverFuncProps) => JSXElement;
}

export type PopoverProps = ControlledProps | UncontrolledProps;
