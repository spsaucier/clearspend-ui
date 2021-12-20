import { formatBigNumber } from '../api/intl/formatCurrency';

export function cleanAmount(val: string): string {
  return val.replace(/[^\d]/g, '');
}

export function parseAmount(val: string): number {
  return parseInt(cleanAmount(val), 10);
}

export function formatAmount(val: string): string {
  const num = parseAmount(val);
  if (Number.isNaN(num)) return '';
  return formatBigNumber(num, { fractions: 0 });
}
