import type { FormOptions } from '_common/components/Form';
import type { MccGroup } from 'transactions/types';
import type { AllocationDetailsResponse, CardAllocationSpendControls } from 'generated/capital';

import {
  getCategories,
  getChannels,
  getPurchasesLimits,
  convertFormLimits,
  getDefaultLimits,
} from '../../utils/convertFormLimits';

import type { FormValues } from './types';

export const defaultValues = {
  categories: [],
  channels: [],
  international: false,
  purchasesLimits: getDefaultLimits(),
};

export function getFormOptions(
  data: Omit<AllocationDetailsResponse, 'allocation'> | undefined,
  categories: readonly Readonly<MccGroup>[],
): FormOptions<FormValues> {
  if (data) {
    return {
      defaultValues: {
        categories: getCategories(data, categories),
        channels: getChannels(data),
        international: !data.disableForeign,
        purchasesLimits: getPurchasesLimits(data),
      },
    };
  }
  return {
    defaultValues,
  };
}

export function convertFormData(
  data: Readonly<FormValues>,
  allocationId: string,
  categories: readonly Readonly<MccGroup>[],
): Readonly<CardAllocationSpendControls> {
  return convertFormLimits(data, categories, allocationId);
}
