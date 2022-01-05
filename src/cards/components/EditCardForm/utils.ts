import { i18n } from '_common/api/intl';
import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import type { IssueCardRequest, MccGroup } from 'generated/capital';
import { getDefaultLimits, convertFormLimits } from 'allocations/utils/convertFormLimits';

import type { CardType } from '../../types';

import type { FormValues } from './types';

function validTypes(value: readonly CardType[]): boolean | string {
  return !!value.length || String(i18n.t('Required field'));
}

interface Options {
  userId: string;
  allocationId: string;
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
      atmLimits: getDefaultLimits(),
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
