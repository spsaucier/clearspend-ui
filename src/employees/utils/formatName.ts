import type { BaseUser } from '../types';

export function formatName(user: Readonly<Pick<BaseUser, 'firstName' | 'lastName'>>): string {
  return [user.firstName, user.lastName].join(' ');
}
