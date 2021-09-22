import { createRoot } from 'solid-js';

export const parameters = {
  // TODO: investigate why it doesn't work
  actions: { argTypesRegex: '^on.+' },
};

export const decorators = [(Story) => createRoot(() => <Story />)];
