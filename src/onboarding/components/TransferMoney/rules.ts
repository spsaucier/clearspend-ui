import type { ValidationRuleFn } from '_common/components/Form/rules/patterns';
import { parseAmount } from '_common/formatters/amount';

export const DEPOSIT_MIN_AMOUNT = 100;
export const validAmount: ValidationRuleFn = (value) => {
  const amount = parseAmount(value);
  return (!Number.isNaN(amount) && amount >= DEPOSIT_MIN_AMOUNT) || 'Invalid amount';
};
