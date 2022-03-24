import { createI18n } from 'solid-i18n';
import type { NumberOptions } from 'i18n-mini/lib/types';

import { NumberFormat, DateFormat } from './types';

const NUMBER_FORMATS: Readonly<Record<NumberFormat, NumberOptions>> = {
  [NumberFormat.default]: { maximumFractionDigits: 2 },
};

const DATE_FORMATS: Readonly<Record<DateFormat, Intl.DateTimeFormatOptions>> = {
  [DateFormat.default]: { day: 'numeric', month: 'short', year: 'numeric' },
  [DateFormat.withTime]: { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' },
  [DateFormat.full]: { day: 'numeric', month: 'long', year: 'numeric' },
  [DateFormat.date]: { day: 'numeric', month: 'numeric', year: 'numeric' },
  [DateFormat.month]: { month: 'short', year: 'numeric' },
  [DateFormat.simple]: { day: 'numeric', month: 'short' },
  [DateFormat.time]: { hour: 'numeric', minute: 'numeric' },
};

export const i18n = createI18n({
  language: 'en',
  presets: {
    number: NUMBER_FORMATS,
    dateTime: DATE_FORMATS,
  },
});
