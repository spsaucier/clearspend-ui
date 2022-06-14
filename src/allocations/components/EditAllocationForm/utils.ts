import type { FormOptions } from '_common/components/Form';
import { parseAmount } from '_common/formatters/amount';
import { required } from '_common/components/Form/rules/required';
import type { CreateAllocationRequest } from 'generated/capital';
import type { MccGroup } from 'transactions/types';

import { DEFAULT_LIMITS, PAYMENT_TYPES } from '../../constants/limits';
import { convertFormLimits } from '../../utils/convertFormLimits';

import type { FormValues } from './types';

export function getFormOptions(categories: readonly Readonly<MccGroup>[], parent?: string): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: '',
      parent: parent || '',
      amount: '',
      categories: [...categories],
      channels: PAYMENT_TYPES.map((item) => item.key),
      international: true,
      purchasesLimits: { ...DEFAULT_LIMITS },
    },
    rules: {
      name: [required],
      parent: [required],
      amount: [required],
    },
  };
}

export function convertFormData(
  data: Readonly<FormValues>,
  categories: readonly Readonly<MccGroup>[],
): Readonly<CreateAllocationRequest> {
  return {
    name: data.name,
    amount: { currency: 'USD', amount: parseAmount(data.amount) },
    parentAllocationId: data.parent,
    ...convertFormLimits(data, categories),
  } as CreateAllocationRequest;
}
