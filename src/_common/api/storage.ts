function get<T>(key: string, defaultValue?: null): T | null;
function get<T>(key: string, defaultValue: T): T;
function get<T>(key: string, defaultValue: T | null = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value !== null ? (JSON.parse(value) as unknown) : defaultValue;
  } catch (error: unknown) {
    return defaultValue;
  }
}

function set<T>(key: string, value: T): boolean {
  try {
    const val = JSON.stringify(value);
    window.localStorage.setItem(key, val);
    return true;
  } catch (error: unknown) {
    return false;
  }
}

function remove(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error: unknown) {
    return false;
  }
}

export const storage = { get, set, remove };
