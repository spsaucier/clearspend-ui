export function toggleArray<T extends string | number>(arr: readonly T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((val) => val !== item) : [...arr, item];
}
