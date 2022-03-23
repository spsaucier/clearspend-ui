import { parseAmount } from '_common/formatters/amount';

import type { FormResult, FormValues } from './types';

export function convertFormData(data: Readonly<FormValues>): Readonly<FormResult> {
  const { amountMin, amountMax, ...rest } = data;
  const min = parseAmount(amountMin || '');
  const max = parseAmount(amountMax || '');
  return {
    ...rest,
    ...((!Number.isNaN(min) || !Number.isNaN(max)) && {
      balance: {
        min: !Number.isNaN(min) ? min : undefined,
        max: !Number.isNaN(max) ? max : undefined,
      },
    }),
  };
}
