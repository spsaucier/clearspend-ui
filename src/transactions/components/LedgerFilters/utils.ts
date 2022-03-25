import type { FormOptions } from '_common/components/Form';
import { parseAmount } from '_common/formatters/amount';
import { dateRangeToISO } from 'app/utils/dateRangeToISO';
import type { LedgerActivityRequest } from 'generated/capital';

import { DEFAULT_LEDGER_PARAMS } from '../../constants';

import type { FormResult, FormValues } from './types';

export function getFormOptions(params: Readonly<LedgerActivityRequest>): FormOptions<FormValues> {
  return {
    defaultValues: {
      amountMin: params.amount?.min?.toString() || '',
      amountMax: params.amount?.max?.toString() || '',
      types: params.types || DEFAULT_LEDGER_PARAMS.types || [],
      date: params.from && params.to ? [new Date(params.from), new Date(params.to)] : [],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<FormResult> {
  const min = parseAmount(data.amountMin);
  const max = parseAmount(data.amountMax);

  return {
    ...((!Number.isNaN(min) || !Number.isNaN(max)) && {
      amount: {
        min: !Number.isNaN(min) ? min : undefined,
        max: !Number.isNaN(max) ? max : undefined,
      },
    }),
    types: data.types.length ? ([...data.types] as LedgerActivityRequest['types']) : undefined,
    ...(Boolean(data.date.length)
      ? dateRangeToISO([data.date[0]!, data.date[1]!])
      : { from: undefined, to: undefined }),
  };
}
