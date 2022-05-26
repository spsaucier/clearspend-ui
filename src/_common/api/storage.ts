function createStorageAPI(storage: Storage) {
  function get<T>(key: string, defaultValue?: null): T | null;
  function get<T>(key: string, defaultValue: T): T;
  function get<T>(key: string, defaultValue: T | null = null) {
    try {
      const value = storage.getItem(key);
      return value !== null ? (JSON.parse(value) as unknown) : defaultValue;
    } catch (error: unknown) {
      return defaultValue;
    }
  }

  function set<T>(key: string, value: T): boolean {
    try {
      const val = JSON.stringify(value);
      storage.setItem(key, val);
      return true;
    } catch (error: unknown) {
      return false;
    }
  }

  function remove(key: string): boolean {
    try {
      storage.removeItem(key);
      return true;
    } catch (error: unknown) {
      return false;
    }
  }

  return { get, set, remove };
}

export const storage = createStorageAPI(window.localStorage);
export const session = createStorageAPI(window.sessionStorage);
