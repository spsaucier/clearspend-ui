import type { ValidationRuleFn } from '_common/components/Form/rules/patterns';

export const PASSWORD_MIN_LENGTH = 10;

export const minLength: ValidationRuleFn = (value) => {
  const pass = value.trim();
  return pass.length >= PASSWORD_MIN_LENGTH || `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
};

export function samePassword<F extends { password: string }>(value: string, values: F): boolean | string {
  return value === values.password || 'Passwords do not match. Please try again.';
}
