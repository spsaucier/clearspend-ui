import { createI18n } from 'solid-i18n';

import { NumberFormat, DateFormat } from './types';

const NUMBER_FORMATS: Readonly<Record<NumberFormat, Intl.NumberFormatOptions>> = {
  [NumberFormat.default]: { maximumFractionDigits: 2 },
};

const DATE_FORMATS: Readonly<Record<DateFormat, Intl.DateTimeFormatOptions>> = {
  [DateFormat.default]: { day: 'numeric', month: 'short', year: 'numeric' },
  [DateFormat.time]: { hour: 'numeric', minute: 'numeric' },
};

export const i18n = createI18n({
  language: 'en',
  presets: {
    // TODO
    // @ts-ignore
    number: NUMBER_FORMATS,
    dateTime: DATE_FORMATS,
  },
});
