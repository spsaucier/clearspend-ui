import type { JSXElement } from 'solid-js';

export interface OptionProps {
  value: string;
  disabled?: boolean;
  class?: string;
  children: string;
}

export interface SelectProps {
  name?: string;
  value?: string;
  valueRender?: (value: string, text: string) => JSXElement;
  up?: boolean; // TODO: Choose automatically
  disabled?: boolean;
  class?: string;
  popupClass?: string;
  popupRender?: (list: JSXElement) => JSXElement;
  placeholder?: string;
  error?: boolean;
  children: JSXElement;
  onChange?: (value: string) => void;
}

export interface SelectContextProps {
  value?: string;
  onChange?: (value: string) => void;
}
