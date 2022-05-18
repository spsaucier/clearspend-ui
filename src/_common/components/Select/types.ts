import type { JSX, JSXElement } from 'solid-js';

import type { IconName } from '../Icon';

export interface OptionProps {
  value: string;
  disabled?: boolean;
  class?: string;
  children: JSXElement;
}

export interface SelectProps {
  onBlur?: JSX.HTMLAttributes<HTMLInputElement>['onBlur'];
  name?: string;
  value?: string;
  valueRender?: (value: string, text: string) => JSXElement;
  disabled?: boolean;
  class?: string;
  popupClass?: string;
  popupPrefix?: JSXElement;
  popupSuffix?: JSXElement;
  placeholder?: string;
  autoComplete?: string;
  error?: boolean;
  children: JSXElement;
  onChange?: (value: string) => void;
  changeOnSearch?: boolean;
  closeOnClear?: boolean;
  loading?: boolean;
  iconName?: keyof typeof IconName;
  darkMode?: boolean;
}

export interface SelectContextProps {
  value?: string;
  onChange?: (value: string) => void;
  close?: (value?: boolean) => void;
}
