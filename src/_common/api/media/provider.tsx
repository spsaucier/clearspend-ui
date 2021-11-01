import { JSXElement, onMount, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import { IMediaContext, MediaContext } from './context';

// NOTE: sync with values in media.css
const BP_MEDIUM = 768;
const BP_LARGE = 1024;
const BP_WIDE = 1200;

const UPDATE_TIMEOUT = 100;

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

  onMount(() => {
    let timeout: number;

    function onResize() {
      clearTimeout(timeout);
      timeout = setTimeout(() => setStore(getState()), UPDATE_TIMEOUT);
    }

    window.addEventListener('resize', onResize);

    onCleanup(() => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    });
  });

  return <MediaContext.Provider value={store}>{props.children}</MediaContext.Provider>;
}
