import type { FormOptions } from '_common/components/Form';
import { getAmountFilter, getDateFilter, toFilterAmount, toFilterDate, toFilterArray } from 'app/utils/filters';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect';
import type { AccountActivityRequest } from 'generated/capital';

import type { FormValues, FormResult } from './types';

export function getFormOptions(params: Readonly<AccountActivityRequest>): FormOptions<FormValues> {
  return {
    defaultValues: {
      ...getAmountFilter(params.amount),
      date: getDateFilter(params),
      allocation: params.allocationId || ALL_ALLOCATIONS,
      categories: [...(params.categories || [])],
      syncStatus: [...(params.syncStatus || [])],
      status: [...(params.statuses || [])],
      hasReceipt: params.withReceipt || (params.withoutReceipt ? false : undefined),
      userId: params.userId || undefined,
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<FormResult> {
  return {
    amount: toFilterAmount(data) || undefined,
    ...toFilterDate(data.date),
    allocationId: data.allocation === ALL_ALLOCATIONS ? undefined : data.allocation,
    categories: toFilterArray(data.categories),
    syncStatus: toFilterArray(data.syncStatus),
    statuses: toFilterArray(data.status),
    withReceipt: data.hasReceipt || undefined,
    withoutReceipt: data.hasReceipt === false || undefined,
    userId: data.userId || undefined,
  };
}
