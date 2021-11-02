export function cloneObject<T extends unknown>(obj: T): T {
  if (obj === undefined) return undefined as T;
  return JSON.parse(JSON.stringify(obj)) as unknown as T;
}
