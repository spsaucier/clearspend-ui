export const PASSWORD_MIN_LENGTH = 10;

export function minLength(value: string): boolean | string {
  const pass = value.trim();
  return pass.length >= PASSWORD_MIN_LENGTH || `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
}

export function samePassword<F extends { password: string }>(value: string, values: F): boolean | string {
  return value === values.password || 'Passwords do not match. Please try again.';
}
