import type { User } from 'generated/capital';

export function canSeeAccounting(user: Readonly<User>) {
  return user.type === 'BUSINESS_OWNER';
}
