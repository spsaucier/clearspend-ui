export const PHONE_MIN_LENGTH = 7;

export function minLength(value: string): boolean | string {
  const pass = value.trim().replace(/\s/g, '');
  return pass.length >= PHONE_MIN_LENGTH || `Phone number must be at least ${PHONE_MIN_LENGTH} characters long.`;
}
