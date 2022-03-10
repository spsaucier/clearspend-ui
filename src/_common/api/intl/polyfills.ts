import { shouldPolyfill as shouldPolyfillLocale } from '@formatjs/intl-locale/should-polyfill';
import { shouldPolyfill as shouldPolyfillListFormat } from '@formatjs/intl-listformat/should-polyfill';

export async function loadPolyfills() {
  if (shouldPolyfillLocale()) {
    await import(/* webpackChunkName: "intl-locale" */ '@formatjs/intl-locale/polyfill');
  }

  if (shouldPolyfillListFormat()) {
    // Load the polyfill 1st BEFORE loading data
    await import(/* webpackChunkName: "intl-list" */ '@formatjs/intl-listformat/polyfill-force');
    await import(/* webpackChunkName: "intl-list-en" */ `@formatjs/intl-listformat/locale-data/en`);
  }
}
