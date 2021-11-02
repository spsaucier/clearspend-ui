import '../src/index.css';

import { createRoot } from 'solid-js';
import { I18nProvider } from 'solid-i18n';

import { i18n } from '../src/_common/api/intl';

export const parameters = {
  // TODO: investigate why it doesn't work
  actions: { argTypesRegex: '^on.+' },
};

export const decorators = [
  (Story) =>
    createRoot(() => (
      <div>
        <I18nProvider i18n={i18n}>
          <Story />
        </I18nProvider>
      </div>
    )),
];
