import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail, validPhone, validZipCode } from '_common/components/Form/rules/patterns';
import { dateToString } from '_common/api/dates';
import { cleanSSN } from '_common/formatters/ssn';
import type { CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';
import { RelationshipToBusiness } from 'app/types/businesses';

import type { FormValues } from './types';

interface Props {
  signupUser?: Partial<User>;
  leader?: CreateOrUpdateBusinessOwnerRequest;
}

const stringToDate = (dateString: string) => {
  return new Date(new Date(dateString).setMinutes(new Date(dateString).getMinutes() + new Date().getTimezoneOffset()));
};

export function getFormOptions({ signupUser, leader }: Props): FormOptions<FormValues> {
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
  };

  const relationshipToBusiness = [];
  if (signupUser?.relationshipToBusiness?.owner) {
    relationshipToBusiness.push(RelationshipToBusiness.OWNER);
  }
  if (signupUser?.relationshipToBusiness?.director) {
    relationshipToBusiness.push(RelationshipToBusiness.DIRECTOR);
  }
  if (signupUser?.relationshipToBusiness?.executive) {
    relationshipToBusiness.push(RelationshipToBusiness.EXECUTIVE);
  }
  const defaultValues = {
    firstName: signupUser?.firstName || '',
    lastName: signupUser?.lastName || '',
    birthdate: undefined,
    ssn: '',
    email: signupUser?.email || '',
    phone: signupUser?.phone || '',
    relationshipToBusiness,
    percentageOwnership: 0,
    title: '',
    streetLine1: '',
    streetLine2: '',
    locality: '',
    region: '',
    postalCode: '',
  };
  if (!leader) return { defaultValues, rules };

  const { address, dateOfBirth, taxIdentificationNumber, ...rest } = leader;
  return {
    defaultValues: {
      ...defaultValues,
      ssn: taxIdentificationNumber,
      birthdate: stringToDate(dateOfBirth),
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
    relationshipToBusiness,
    ...address
  } = data;
  return {
    firstName,
    lastName,
    dateOfBirth: dateToString(birthdate!),
    taxIdentificationNumber: cleanSSN(ssn),
    email,
    phone,
    percentageOwnership,
    title,
    relationshipOwner: relationshipToBusiness.includes(RelationshipToBusiness.OWNER),
    relationshipExecutive: relationshipToBusiness.includes(RelationshipToBusiness.EXECUTIVE),
    relationshipDirector: relationshipToBusiness.includes(RelationshipToBusiness.DIRECTOR),
    relationshipRepresentative: true,
    address: { ...address, country: 'USA' },
  };
}
