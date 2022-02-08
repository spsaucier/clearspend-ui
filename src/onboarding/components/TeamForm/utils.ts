import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail, validPhone, validZipCode } from '_common/components/Form/rules/patterns';
import { dateToString } from '_common/api/dates';
import { cleanSSN } from '_common/formatters/ssn';
import type { CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';
import { RelationshipToBusiness } from 'app/types/businesses';

import type { FormValues } from './types';
export function getFormOptions(user?: Partial<User>): FormOptions<FormValues> {
  const relationshipToBusiness = [];
  if (user?.relationshipToBusiness?.owner) {
    relationshipToBusiness.push(RelationshipToBusiness.OWNER);
  }
  if (user?.relationshipToBusiness?.director) {
    relationshipToBusiness.push(RelationshipToBusiness.DIRECTOR);
  }
  if (user?.relationshipToBusiness?.executive) {
    relationshipToBusiness.push(RelationshipToBusiness.EXECUTIVE);
  }
  return {
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      birthdate: undefined,
      ssn: '',
      email: user?.email || '',
      phone: user?.phone || '',
      streetLine1: '',
      streetLine2: '',
      locality: '',
      region: '',
      postalCode: '',
      relationshipToBusiness,
      percentageOwnership: 0,
      title: '',
    },
    rules: {
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
    },
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
