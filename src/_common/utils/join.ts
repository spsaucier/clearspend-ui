import { isString } from './isString';

export function join(...items: readonly (string | undefined)[]): string {
  return items.filter(isString).join(' ');
}
