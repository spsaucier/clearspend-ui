import { isString } from '_common/utils/isString';

export function required(value?: unknown): boolean | string {
  return (isString(value) && !!value.trim()) || !!value || 'Required field';
}

export function requiredIf(value?: unknown, parentValue?: unknown): boolean | string {
  return !parentValue || required(value === '0' ? null : value);
}
