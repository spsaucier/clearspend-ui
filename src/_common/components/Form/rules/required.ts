import { isString } from '_common/utils/isString';

export function required(value?: unknown): boolean | string {
  return (isString(value) && !!value.trim()) || !!value || 'Required field';
}
