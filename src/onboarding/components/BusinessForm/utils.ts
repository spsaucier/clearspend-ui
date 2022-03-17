import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { maxLength } from '_common/components/Form/rules/maxLength';
import { validPhone, validEIN, validZipCode } from '_common/components/Form/rules/patterns';
import { cleanEIN } from '_common/formatters/ein';
import type { Business, ConvertBusinessProspectRequest, UpdateBusiness } from 'generated/capital';

import type { FormValues } from './types';
import type { BusinessWithBusinessName } from './BusinessForm';

export const BUSINESS_DESCRIPTION_MAX_LENGTH = 200;
export function getFormOptions(
  type: Business['businessType'],
  prefill?: BusinessWithBusinessName,
): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: prefill?.legalName ?? '',
      type: type!,
      url: prefill?.url ?? '',
      mcc: prefill?.mcc ?? '',
      description: prefill?.description ?? '',
      employerIdentificationNumber: prefill?.employerIdentificationNumber ?? '',
      phone: prefill?.businessPhone ?? '',
      streetLine1: prefill?.address?.streetLine1 ?? '',
      streetLine2: prefill?.address?.streetLine2 ?? '',
      locality: prefill?.address?.locality ?? '',
      region: prefill?.address?.region ?? '',
      postalCode: prefill?.address?.postalCode ?? '',
      businessName: prefill?.businessName ?? '',
    },
    rules: {
      name: [required],
      type: [required],
      mcc: [required],
      employerIdentificationNumber: [required, (val) => validEIN(cleanEIN(val))],
      phone: [validPhone],
      streetLine1: [required],
      locality: [required],
      region: [required],
      postalCode: [required, validZipCode],
      description: [maxLength(BUSINESS_DESCRIPTION_MAX_LENGTH)],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<ConvertBusinessProspectRequest | UpdateBusiness> {
  const { name, employerIdentificationNumber, businessName, phone, mcc, url, description, type, ...address } = data;
  return {
    legalName: name,
    employerIdentificationNumber: cleanEIN(employerIdentificationNumber),
    businessPhone: phone,
    address: { ...address, country: 'USA' },
    mcc,
    url,
    businessType: type as UpdateBusiness['businessType'],
    description,
    businessName,
  };
}
