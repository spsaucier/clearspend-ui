export type VPos = 'top' | 'bottom';
export type HPos = 'left' | 'center' | 'right';

export type PopoverPosition = `${VPos}-${HPos}`;

export interface FuncProps {
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
