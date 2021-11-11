import type { BaseUser } from '../types';

export function formatName(user: Readonly<BaseUser>): string {
  return [user.firstName, user.lastName].join(' ');
}
