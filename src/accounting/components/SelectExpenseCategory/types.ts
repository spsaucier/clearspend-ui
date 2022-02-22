import type { JSXElement } from 'solid-js';

import type { ExpenseCategory } from 'generated/capital';

export interface SelectExpenseCateogryContextProps {
  value?: ExpenseCategory | undefined;
  onChange?: (value: ExpenseCategory | undefined) => void;
  close?: (value?: boolean) => void;
}

export interface SelectExpenseCategoryOptionProps {
  value: ExpenseCategory;
  disabled?: boolean;
  class?: string;
  children: JSXElement;
}
