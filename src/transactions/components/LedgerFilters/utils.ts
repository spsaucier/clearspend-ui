import type { FormOptions } from '_common/components/Form';
import { getAmountFilter, getDateFilter, toFilterAmount, toFilterDate, toFilterArray } from 'app/utils/filters';
import type { LedgerActivityRequest } from 'generated/capital';

import { DEFAULT_LEDGER_PARAMS } from '../../constants';
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
    amount: toFilterAmount(data) || undefined,
    ...toFilterDate(data.date),
    types: toFilterArray(data.types),
  };
}
