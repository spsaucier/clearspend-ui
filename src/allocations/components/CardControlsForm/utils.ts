import type { FormOptions } from '_common/components/Form';
import type { MccGroup } from 'transactions/types';

import { getCategories, getChannels, getPurchasesLimits, convertFormLimits } from '../../utils/convertFormLimits';
import type { ControlsData } from '../../types';

import type { FormValues } from './types';

export function getFormOptions(
  data: Readonly<ControlsData>,
  categories: readonly Readonly<MccGroup>[],
): FormOptions<FormValues> {
  return {
    defaultValues: {
      categories: getCategories(data, categories),
      channels: getChannels(data),
      purchasesLimits: getPurchasesLimits(data),
    },
  };
}

export function convertFormData(
  data: Readonly<FormValues>,
  categories: readonly Readonly<MccGroup>[],
): Readonly<ControlsData> {
  return convertFormLimits(data, categories);
}
