import type { JSX } from 'solid-js';

export type SetterFunc<T> = (params: T) => T;
export type Setter<T> = (setter: T | SetterFunc<T>) => void;

export type JSXEvent<T, E extends Event> = Parameters<JSX.EventHandler<T, E>>[0];
