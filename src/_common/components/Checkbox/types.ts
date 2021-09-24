import type { JSX } from 'solid-js';

export interface CheckboxGroupProps {
  value?: string[];
  class?: string;
  disabled?: boolean;
  children: JSX.Element;
  onChange?: (value: string[]) => void;
}

export interface CheckboxProps {
  value?: string;
  checked?: boolean;
  class?: string;
  disabled?: boolean;
  children?: JSX.Element;
  onChange?: (checked: boolean) => void;
}
