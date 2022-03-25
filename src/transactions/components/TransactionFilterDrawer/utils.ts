import type { FormOptions } from '_common/components/Form';
import type { AccountActivityRequest } from 'generated/capital';

import { getAmountFilter, getDateFilter, toFilterAmount, toFilterDate } from '../../utils/filters';

import type { FormValues, FormResult } from './types';

export function getFormOptions(params: Readonly<AccountActivityRequest>): FormOptions<FormValues> {
  return {
    defaultValues: {
      ...getAmountFilter(params.amount),
      date: getDateFilter(params),
      categories: [...(params.categories || [])],
      syncStatus: [],
      status: [...(params.statuses || [])],
      hasReceipt: params.withReceipt || (params.withoutReceipt ? false : undefined),
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<FormResult> {
  return {
    ...toFilterAmount(data),
    ...toFilterDate(data.date),
    categories: data.categories.length ? [...data.categories] : undefined,
    statuses: data.status.length ? [...data.status] : undefined,
    withReceipt: data.hasReceipt || undefined,
    withoutReceipt: data.hasReceipt === false || undefined,
  };
}
