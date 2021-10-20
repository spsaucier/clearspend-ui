import { parseAmount } from '_common/formatters/amount';

export const DEPOSIT_MIN_AMOUNT = 100;

export function validAmount(value: string): boolean | string {
  const amount = parseAmount(value);
  return (!Number.isNaN(amount) && amount >= DEPOSIT_MIN_AMOUNT) || 'Invalid amount';
}
