import type { FormOptions } from '_common/components/Form';
import { parseAmount } from '_common/formatters/amount';
import { required } from '_common/components/Form/rules/required';
import type { SwitchGroupBoxItem } from 'app/components/SwitchGroupBox';
import type { CreateAllocationRequest, MccGroup } from 'generated/capital';

import type { FormValues } from './types';

export function getFormOptions(): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: '',
      parent: '',
      amount: '',
      owner: '',
      categories: [],
      channels: [],
    },
    rules: {
      name: [required],
      parent: [required],
      amount: [required],
      owner: [required],
    },
  };
}

export function convertFormData(
  data: Readonly<FormValues>,
  types: readonly Readonly<SwitchGroupBoxItem>[],
  categories: readonly Readonly<MccGroup>[],
): Readonly<CreateAllocationRequest> {
  return {
    name: data.name,
    amount: { currency: 'USD', amount: parseAmount(data.amount) },
    parentAllocationId: data.parent,
    ownerId: data.owner,
    limits: [{ currency: 'USD', typeMap: {} }],
    disabledMccGroups: categories
      .map((item) => item.mccGroupId)
      .filter((id) => !data.categories.includes(id!)) as string[],
    disabledTransactionChannels: types
      .map((item) => item.key)
      .filter((id) => !data.channels.includes(id)) as CreateAllocationRequest['disabledTransactionChannels'],
  };
}
