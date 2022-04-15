import { i18n } from './index';

interface FormatCurrencyOptions {
  currency?: string;
  fractions?: number;
}

export function formatCurrency(value: number, options?: Readonly<Partial<FormatCurrencyOptions>>): string {
  return i18n.formatNumber(value, {
    style: 'currency',
    currency: options?.currency || 'USD',
    minimumFractionDigits: options?.fractions,
    maximumFractionDigits: options?.fractions,
  });
}
