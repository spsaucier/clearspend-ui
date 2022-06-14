import type { FormOptions } from '_common/components/Form';
import { oneRequired, required } from '_common/components/Form/rules/required';
import { isString } from '_common/utils/isString';
import { convertFormLimits } from 'allocations/utils/convertFormLimits';
import { getEmptyAddress } from 'employees/components/AddressFormItems/utils';
import type { MccGroup } from 'transactions/types';
import type { IssueCardRequest } from 'generated/capital';
import type { FormLimits } from 'allocations/types';

import { CardType } from '../../types';

import type { FormValues } from './types';

interface Options {
  userId: string;
  allocationId: string;
}

export function requiredAddress(value: string, values: FormValues): boolean | string {
  if (values.type === CardType.PHYSICAL) {
    return (isString(value) && !!value.trim()) || !!value || 'Please choose a delivery address';
  }
  return true;
}

export function getFormOptions(data: Partial<Readonly<Options>>): FormOptions<FormValues> {
  return {
    defaultValues: {
      allocations: data.allocationId ? [data.allocationId] : [],
      employee: data.userId || '',
      type: '',
      personal: true,
      ...getEmptyAddress(),
    },
    rules: {
      allocations: [oneRequired],
      employee: [required],
      type: [required],
      streetLine1: [requiredAddress],
      locality: [requiredAddress],
      region: [requiredAddress],
      postalCode: [requiredAddress],
    },
  };
}

export const convertToSpendControls = (
  allocationsMap: {
    [allocationId: string]: FormLimits;
  },
  categories: readonly Readonly<MccGroup>[],
) =>
  Object.entries(allocationsMap).map(([allocationId, allocationData]) =>
    convertFormLimits(allocationData, categories, allocationId),
  );

export function convertFormData(
  data: Readonly<FormValues>,
  allocationsMap: {
    [allocationId: string]: FormLimits;
  },
  categories: readonly Readonly<MccGroup>[],
): Readonly<IssueCardRequest> {
  return {
    binType: 'DEBIT',
    userId: data.employee,
    currency: 'USD',
    cardType: [data.type === 'ADD_TO_PHYSICAL' ? 'PHYSICAL' : data.type || 'PHYSICAL'], // TODO: TS remove || 'PHYSICAL'
    isPersonal: data.personal,
    allocationSpendControls: convertToSpendControls(allocationsMap, categories),
    shippingAddress: {
      streetLine1: data.streetLine1,
      streetLine2: data.streetLine2,
      locality: data.locality,
      region: data.region,
      postalCode: data.postalCode,
      country: 'USA',
    },
  };
}
