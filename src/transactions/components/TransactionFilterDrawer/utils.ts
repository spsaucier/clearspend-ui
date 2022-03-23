import type { FormOptions } from '_common/components/Form';
import { parseAmount } from '_common/formatters/amount';
import { dateRangeToISO } from 'app/utils/dateRangeToISO';
import type { AccountActivityRequest } from 'generated/capital';

import type { FormValues, FormResult } from './types';

export function getFormOptions(params: Readonly<AccountActivityRequest>): FormOptions<FormValues> {
  return {
    defaultValues: {
      amountMin: params.amount?.min?.toString() || '',
      amountMax: params.amount?.max?.toString() || '',
      categories: [...(params.categories || [])],
      syncStatus: [],
      status: [...(params.statuses || [])],
      hasReceipt: params.withReceipt || (params.withoutReceipt ? false : undefined),
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
    categories: data.categories.length ? [...data.categories] : undefined,
    statuses: data.status.length ? [...data.status] : undefined,
    withReceipt: data.hasReceipt || undefined,
    withoutReceipt: data.hasReceipt === false || undefined,
    ...(Boolean(data.date.length)
      ? dateRangeToISO([data.date[0]!, data.date[1]!])
      : { from: undefined, to: undefined }),
  };
}
