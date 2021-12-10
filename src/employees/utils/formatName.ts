import type { User } from 'generated/capital';

export function formatName(user: Readonly<Pick<User, 'firstName' | 'lastName'>> | undefined): string {
  if (!user) return '';
  return [user.firstName, user.lastName].join(' ');
}
