export const PASSWORD_MIN_LENGTH = 8;

export function minLength(value: string): boolean | string {
  const pass = value.trim();
  return pass.length >= PASSWORD_MIN_LENGTH || `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
}

export function getConfirmRule(password: () => string) {
  return (value: string): boolean | string => {
    return value === password() || 'Passwords do not match. Please try again.';
  };
}
