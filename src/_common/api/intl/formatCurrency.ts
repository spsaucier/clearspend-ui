import { i18n } from './index';

interface FormatCurrencyOptions {
  fractions: number;
}

export function formatCurrency(value: number, options?: Readonly<Partial<FormatCurrencyOptions>>): string {
  return i18n.formatNumber(value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options?.fractions,
    maximumFractionDigits: options?.fractions,
  });
}
