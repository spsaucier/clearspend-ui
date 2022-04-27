import 'matchmedia-polyfill';
import { createRoot, type JSXElement } from 'solid-js';

import { keys } from '_common/utils/keys';
import { wait } from '_common/utils/wait';

import { Providers } from '../containers/providers';

export const updates = (): Promise<unknown> => wait(0);

export function createRootWithProviders(children: JSXElement): () => void {
  let dispose!: () => void;

  createRoot((d) => {
    dispose = d;

    return <Providers>{children}</Providers>;
  });

  return dispose;
}

export function getLocationController() {
  const originalLocation = window.location;

  const replace = (values: Partial<Location>) => {
    // @ts-ignore
    delete window.location;

    // @ts-ignore
    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(originalLocation),
        ...keys(values).reduce<Partial<Record<keyof Location, PropertyDescriptor>>>((acc, key) => {
          acc[key] = { configurable: true, value: values[key] };
          return acc;
        }, {}),
      },
    );
  };

  const restore = () => {
    window.location = originalLocation;
  };

  return { replace, restore };
}
