import type { FormOptions } from '_common/components/Form';
import { required, requiredIf } from '_common/components/Form/rules/required';
import { validEmail, validPhone, validZipCode } from '_common/components/Form/rules/patterns';
import { dateToString } from '_common/api/dates';
import { cleanSSN } from '_common/formatters/ssn';
import { getEmptyAddress } from 'employees/components/AddressFormItems/utils';
import type { CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';

import type { FormValues } from './types';

interface Props {
  currentUser?: Partial<User>;
  leader?: CreateOrUpdateBusinessOwnerRequest;
}

const stringToDate = (dateString: string) => {
  return new Date(new Date(dateString).setMinutes(new Date(dateString).getMinutes() + new Date().getTimezoneOffset()));
};

export function getFormOptions({ currentUser, leader }: Props): FormOptions<FormValues> {
  const rules = {
    firstName: [required],
    lastName: [required],
    birthdate: [required],
    ssn: [required],
    email: [required, validEmail],
    phone: [required, validPhone],
    streetLine1: [required],
    locality: [required],
    region: [required],
    postalCode: [required, validZipCode],
    percentageOwnership: [(value: string, values: FormValues) => requiredIf(value, values.relationshipOwner)],
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
    percentageOwnership: parseInt(percentageOwnership, 10),
    title,
    relationshipOwner,
    relationshipExecutive,
    address: { ...address, country: 'USA' },
  };
}
