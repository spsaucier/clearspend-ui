import { i18n } from '_common/api/intl';
import type { FormOptions } from '_common/components/Form';
import { required, requiredIf } from '_common/components/Form/rules/required';
import { validEmail, validPhone, validZipCode, type ValidationRuleFn } from '_common/components/Form/rules/patterns';
import { dateToString } from '_common/api/dates';
import { cleanSSN } from '_common/formatters/ssn';
import { getEmptyAddress } from 'employees/components/AddressFormItems/utils';
import type { Business, CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';
import { BusinessType } from 'app/types/businesses';

import { OWNERSHIP_FULL_PERCENTAGE, OWNERSHIP_MIN_PERCENT } from './constants';
import type { FormValues } from './types';

interface Props {
  currentUser?: Partial<User>;
  leader?: CreateOrUpdateBusinessOwnerRequest;
  business: Business;
}

const stringToDate = (dateString: string) => {
  const utcDate = new Date(dateString);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
};

export function getFormOptions({ currentUser, leader, business }: Props): FormOptions<FormValues> {
  const shouldRequirePercentOwnership = (values: FormValues) =>
    values.relationshipOwner &&
    ![BusinessType.SOLE_PROPRIETORSHIP, BusinessType.INCORPORATED_NON_PROFIT].includes(
      business.businessType as BusinessType,
    );

  const rules = {
    firstName: [required],
    lastName: [required],
    title: [required],
    birthdate: [required],
    ssn: [required],
    email: [required, validEmail],
    phone: [required, validPhone],
    streetLine1: [required],
    locality: [required],
    region: [required],
    postalCode: [required, validZipCode],
    percentageOwnership: [
      (value: string, values: FormValues) => requiredIf(value, shouldRequirePercentOwnership(values)),
      (value: string, values: FormValues) =>
        shouldRequirePercentOwnership(values) ? validOwnershipPercentage(value) : true,
    ],
  };

  const relationshipExecutive = currentUser?.relationshipToBusiness?.executive;
  const relationshipOwner = currentUser?.relationshipToBusiness?.owner;

  const defaultValues = {
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    birthdate: undefined,
    ssn: '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    relationshipExecutive,
    relationshipOwner,
    percentageOwnership: '0',
    title: '',
    ...getEmptyAddress(),
  };
  if (!leader) return { defaultValues, rules };

  const { address, dateOfBirth, taxIdentificationNumber, percentageOwnership, ...rest } = leader;
  return {
    defaultValues: {
      ...defaultValues,
      ssn: taxIdentificationNumber,
      birthdate: stringToDate(dateOfBirth),
      percentageOwnership: percentageOwnership?.toString() || '',
      ...address,
      ...rest,
    },
    rules,
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<CreateOrUpdateBusinessOwnerRequest> {
  const {
    firstName,
    lastName,
    birthdate,
    ssn,
    email,
    phone,
    percentageOwnership,
    title,
    relationshipExecutive,
    relationshipOwner,
    ...address
  } = data;
  return {
    firstName,
    lastName,
    dateOfBirth: dateToString(birthdate!),
    taxIdentificationNumber: cleanSSN(ssn),
    email,
    phone,
    percentageOwnership: relationshipOwner ? parseInt(percentageOwnership, 10) : 0,
    title,
    relationshipOwner,
    relationshipExecutive,
    address: { ...address, country: 'USA' },
  };
}

export const validOwnershipPercentage: ValidationRuleFn = (value) => {
  const percent = +value;
  return (
    (percent <= OWNERSHIP_FULL_PERCENTAGE && percent >= OWNERSHIP_MIN_PERCENT) ||
    String(i18n.t('Must be at least {min}%', { min: OWNERSHIP_MIN_PERCENT }))
  );
};

export const hasOwner = (leader: CreateOrUpdateBusinessOwnerRequest) => !!leader.relationshipOwner;

export function kycHasExecutiveError(kycErrors?: Readonly<{ [key: string]: string[] }>): boolean {
  let hasExecutiveError = false;
  if (kycErrors) {
    Object.keys(kycErrors).forEach((key) => {
      if (kycErrors[key]?.includes('relationshipExecutive')) {
        hasExecutiveError = true;
      }
    });
  }
  return hasExecutiveError;
}
