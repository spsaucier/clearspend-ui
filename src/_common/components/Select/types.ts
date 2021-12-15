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
  disabled?: boolean;
  class?: string;
  popupClass?: string;
  popupRender?: (list: JSXElement) => JSXElement;
  placeholder?: string;
  error?: boolean;
  children: JSXElement;
  onChange?: (value: string) => void;
  changeOnSearch?: boolean;
  loading?: boolean;
}

export interface SelectContextProps {
  value?: string;
  onChange?: (value: string) => void;
  close?: (value?: boolean) => void;
}
