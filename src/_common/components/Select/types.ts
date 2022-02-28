import type { JSXElement } from 'solid-js';

import type { IconName } from '../Icon/types';

export interface OptionProps {
  value: string;
  disabled?: boolean;
  class?: string;
  children: JSXElement;
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
  autoComplete?: string;
  error?: boolean;
  children: JSXElement;
  onChange?: (value: string) => void;
  changeOnSearch?: boolean;
  loading?: boolean;
  iconName?: keyof typeof IconName;
  darkMode?: boolean;
  blurOnSelect?: boolean;
}

export interface SelectContextProps {
  value?: string;
  onChange?: (value: string) => void;
  close?: (value?: boolean) => void;
}
