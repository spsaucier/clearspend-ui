import { isString } from './isString';

export function join(...items: readonly (string | boolean | undefined)[]): string {
  return items.filter(isString).join(' ');
}
