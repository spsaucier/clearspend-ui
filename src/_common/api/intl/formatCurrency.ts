import { i18n } from './index';

export function formatCurrency(value: number): string {
  return i18n.formatNumber(value, { style: 'currency', currency: 'USD' });
}
