import { batch } from 'solid-js';

import { keys } from '_common/utils/keys';

import type { FieldErrors } from '../types/common';

function isObject<T extends object>(obj: unknown): obj is T {
  return typeof obj === 'object' && obj !== null;
}

function getFieldErrors(error: unknown): Readonly<FieldErrors> | null {
  return isObject<{ data?: object }>(error) &&
    isObject<{ message?: object }>(error.data) &&
    isObject<{ fieldErrors?: FieldErrors }>(error.data.message) &&
    isObject(error.data.message.fieldErrors)
    ? error.data.message.fieldErrors
    : null;
}

export function handleFieldErrors(
  error: unknown,
  config: Readonly<Record<string, () => void>>,
  fallback: () => void,
): void {
  let handled: boolean = false;
  const fieldErrors = getFieldErrors(error) || {};

  batch(() => {
    keys(fieldErrors).forEach((field) => {
      const code = fieldErrors[field]![0]?.code;

      if (code && config[code]) {
        config[code]!();
        handled = true;
      }
    });
  });

  if (!(handled as boolean)) fallback();
}
