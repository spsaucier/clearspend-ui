import type { JSX } from 'solid-js';

export interface CheckboxGroupProps {
  name?: string;
  value?: string[];
  class?: string;
  empty?: boolean;
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
  darkMode?: boolean;
}
