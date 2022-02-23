import type { FormOptions } from '_common/components/Form';
import { parseAmount } from '_common/formatters/amount';
import { required } from '_common/components/Form/rules/required';
import type { CreateAllocationRequest } from 'generated/capital';
import type { MccGroup } from 'transactions/types';

import { DEFAULT_LIMITS } from '../../constants/limits';
import { convertFormLimits } from '../../utils/convertFormLimits';

import type { FormValues } from './types';

export function getFormOptions(): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: '',
      parent: '',
      amount: '',
      categories: [],
      channels: [],
      purchasesLimits: { ...DEFAULT_LIMITS },
    },
    rules: {
      name: [required],
      parent: [required],
      amount: [required],
      // TODO: add rules for limits
    },
  };
}

export function convertFormData(
  ownerId: string,
  data: Readonly<FormValues>,
  categories: readonly Readonly<MccGroup>[],
): Readonly<CreateAllocationRequest> {
  return {
    name: data.name,
    amount: { currency: 'USD', amount: parseAmount(data.amount) },
    parentAllocationId: data.parent,
    ownerId,
    ...convertFormLimits(data, categories),
  };
}
