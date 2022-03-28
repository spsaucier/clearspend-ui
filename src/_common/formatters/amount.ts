import { i18n } from '../api/intl';

function cleanAmount(val: string): string {
  return val.replace(/[^\d.]/g, '');
}

export function parseAmount(val: string): number {
  return parseFloat(cleanAmount(val));
}

export function formatAmount(val: string): string {
  const num = parseAmount(val.toString());
  if (Number.isNaN(num)) return '';
  return i18n.formatNumber(num, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
