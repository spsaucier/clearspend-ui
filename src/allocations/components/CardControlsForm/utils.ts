/* eslint-disable no-param-reassign */

import type { FormOptions } from '_common/components/Form';
import type { MccGroup } from 'generated/capital';

import {
  getCategories,
  getChannels,
  getPurchasesLimits,
  getATMLimits,
  convertFormLimits,
} from '../../utils/convertFormLimits';
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
      atmLimits: getATMLimits(data),
    },
    rules: {
      // TODO: add rules for limits
    },
  };
}

export function convertFormData(
  data: Readonly<FormValues>,
  categories: readonly Readonly<MccGroup>[],
): Readonly<ControlsData> {
  return convertFormLimits(data, categories);
}
