import type { JSXElement } from 'solid-js';
import { createStore } from 'solid-js/store';

import { IMediaContext, MediaContext } from './context';
import { useWindowResize } from './useWindowResize';

// NOTE: sync with values in media.css
const BP_MEDIUM = 768;
const BP_LARGE = 1024;
const BP_WIDE = 1200;

function match(width: number): boolean {
  return window.matchMedia(`(min-width: ${width}px)`).matches;
}

function getState(): Readonly<IMediaContext> {
  const medium = match(BP_MEDIUM);
  return { small: !medium, medium, large: match(BP_LARGE), wide: match(BP_WIDE) };
}

interface MediaProviderProps {
  children: JSXElement;
}

export function MediaProvider(props: Readonly<MediaProviderProps>) {
  const [store, setStore] = createStore(getState());
  useWindowResize(() => setStore(getState()));

  return <MediaContext.Provider value={store}>{props.children}</MediaContext.Provider>;
}
