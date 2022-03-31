import type { FormOptions } from '_common/components/Form';
import type { LedgerActivityRequest } from 'generated/capital';

import { DEFAULT_LEDGER_PARAMS } from '../../constants';
import { getAmountFilter, getDateFilter, toFilterAmount, toFilterDate } from '../../utils/filters';
import type { LedgerActivityType } from '../../types';

import type { FormResult, FormValues } from './types';

export function getFormOptions(params: Readonly<LedgerActivityRequest>): FormOptions<FormValues> {
  return {
    defaultValues: {
      ...getAmountFilter(params.amount),
      date: getDateFilter(params),
      types: (params.types || DEFAULT_LEDGER_PARAMS.types || []) as LedgerActivityType[],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<FormResult> {
  return {
    ...toFilterAmount(data),
    ...toFilterDate(data.date),
    types: data.types.length ? [...data.types] : undefined,
  };
}
