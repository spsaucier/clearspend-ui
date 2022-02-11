import { i18n } from '_common/api/intl';
import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { isString } from '_common/utils/isString';
import type { IssueCardRequest } from 'generated/capital';
import { getDefaultLimits, convertFormLimits } from 'allocations/utils/convertFormLimits';

import { CardType, MccGroup } from '../../types';

import type { FormValues } from './types';

function validTypes(value: readonly CardType[]): boolean | string {
  return !!value.length || String(i18n.t('Required field'));
}

interface Options {
  userId: string;
  allocationId: string;
}

export function requiredAddress(value: string, values: FormValues): boolean | string {
  if (values.types.includes(CardType.PHYSICAL)) {
    return (isString(value) && !!value.trim()) || !!value || 'Please choose a delivery address';
  }
  return true;
}

export function getFormOptions(data: Partial<Readonly<Options>>): FormOptions<FormValues> {
  return {
    defaultValues: {
      allocationId: data.allocationId || '',
      employee: data.userId || '',
      types: [],
      personal: false,
      categories: [],
      channels: [],
      purchasesLimits: getDefaultLimits(),
      streetLine1: '',
      streetLine2: '',
      locality: '',
      region: '',
      postalCode: '',
    },
    rules: {
      allocationId: [required],
      employee: [required],
      types: [validTypes],
      streetLine1: [requiredAddress],
      locality: [requiredAddress],
      region: [requiredAddress],
      postalCode: [requiredAddress],
      // TODO: add rules for limits
    },
  };
}

export function convertFormData(
  data: Readonly<FormValues>,
  categories: readonly Readonly<MccGroup>[],
): Readonly<IssueCardRequest> {
  return {
    binType: 'DEBIT',
    allocationId: data.allocationId,
    userId: data.employee,
    currency: 'USD',
    cardType: data.types,
    isPersonal: data.personal,
    shippingAddress: {
      streetLine1: data.streetLine1,
      streetLine2: data.streetLine2,
      locality: data.locality,
      region: data.region,
      postalCode: data.postalCode,
      country: 'USA',
    },
    ...convertFormLimits(data, categories),
  };
}
