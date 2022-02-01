export function getResetFilters<K extends string>(keys: readonly K[]): Record<K, undefined> {
  return keys.reduce((res, key) => {
    // eslint-disable-next-line no-param-reassign
    res[key] = undefined;
    return res;
  }, {} as Record<K, undefined>);
}
