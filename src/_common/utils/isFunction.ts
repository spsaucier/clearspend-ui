export function isFunction<F extends Function>(value: unknown): value is F {
  return typeof value === 'function';
}
