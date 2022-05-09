import { i18n } from '_common/api/intl';

export type ValidationRuleFn = (value: string) => boolean | string;

export const validEmail: ValidationRuleFn = (value) => {
  return !!value.match(/^[^@]+@[^@.]+\.[^@]+$/) || 'Invalid email';
};

export const validPhone: ValidationRuleFn = (value) => {
  if (!value) return true;
  return !!value.match(/^\+[1-9][0-9]{9,14}$/) || 'Invalid phone number';
};

export const validEIN: ValidationRuleFn = (value) => {
  return !!value.match(/^[1-9][0-9]{8}$/) || 'EIN should consist of 9 digits';
};

export const validZipCode: ValidationRuleFn = (value) => {
  return !!value.match(/^[0-9]{5}(?:-[0-9]{4})?$/) || 'Invalid zip code';
};

export const validCode: ValidationRuleFn = (value) => {
  return /^\d{4}$/.test(value) || String(i18n.t('Inappropriate value'));
};

export const validStreetLine1: ValidationRuleFn = (value) => {
  return value.toLocaleLowerCase().replace('.', '').indexOf('po ') !== 0 || 'PO Boxes are not allowed';
};
