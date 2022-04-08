import 'matchmedia-polyfill';
import { createRoot, type JSXElement } from 'solid-js';

import { Providers } from '../containers/providers';

export function createRootWithProviders(children: JSXElement): () => void {
  let dispose!: () => void;

  createRoot((d) => {
    dispose = d;

    return <Providers>{children}</Providers>;
  });

  return dispose;
}
