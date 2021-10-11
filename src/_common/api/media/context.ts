import { createContext, useContext } from 'solid-js';

export interface IMediaContext {
  small: boolean;
  medium: boolean;
  large: boolean;
}

export const MediaContext = createContext<Readonly<IMediaContext>>();

export function useMediaContext(): Readonly<IMediaContext> {
  const context = useContext(MediaContext);
  if (!context) throw new Error();

  return context;
}
