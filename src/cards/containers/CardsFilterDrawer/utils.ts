import type { FormOptions } from '_common/components/Form';
import { getAmountFilter, toFilterAmount, toFilterArray } from 'app/utils/filters';
import type { SearchCardRequest } from 'generated/capital';

import type { FormResult, FormValues } from './types';

export function getFormOptions(params: Readonly<SearchCardRequest>): FormOptions<FormValues> {
  return {
    defaultValues: {
      ...getAmountFilter(params.balance),
      allocations: [...(params.allocations || [])],
      users: [...(params.users || [])],
      statuses: [...(params.statuses || [])],
      types: [...(params.types || [])],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<FormResult> {
  return {
    balance: toFilterAmount(data) || undefined,
    allocations: toFilterArray(data.allocations),
    statuses: toFilterArray(data.statuses),
    types: toFilterArray(data.types),
    users: toFilterArray(data.users),
  };
}
