import { createContext } from 'solid-js';

export interface IPageContext {
  current: Node | undefined;
}

export const PageContext = createContext<IPageContext>({ current: undefined });
