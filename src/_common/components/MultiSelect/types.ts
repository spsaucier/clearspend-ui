import type { JSXElement } from 'solid-js';

export interface OptionProps {
  value: string;
  disabled?: boolean;
  class?: string;
  children: JSXElement;
}

export interface MultiSelectProps {
  name?: string;
  value?: string[];
  valueRender?: (value: string) => JSXElement;
  disabled?: boolean;
  class?: string;
  popupClass?: string;
  popupRender?: (list: JSXElement) => JSXElement;
  placeholder?: string;
  error?: boolean;
  children: JSXElement;
  onChange?: (value: string[]) => void;
  changeOnSearch?: boolean;
  loading?: boolean;
}

export interface MultiSelectContextProps {
  value?: string[];
  onChange?: (value: string) => void;
  close?: (value?: boolean) => void;
}
