import type { User } from '../types';

export function formatName(user: Readonly<User>): string {
  return [user.firstName, user.lastName].join(' ');
}
