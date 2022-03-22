export type SetterFunc<T> = (params: T) => T;
export type Setter<T> = (setter: T | SetterFunc<T>) => void;
