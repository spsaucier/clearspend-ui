import type { JSXElement } from 'solid-js';

import type { User } from 'generated/capital';

export function formatName(user: Readonly<Pick<User, 'firstName' | 'lastName'>> | undefined): JSXElement {
  if (!user) return '';
  return (
    <span>
      {`${user.firstName} `}
      <span class="fa-mask">{user.lastName}</span>
    </span>
  );
}

export function formatNameString(user: Readonly<Pick<User, 'firstName' | 'lastName'>> | undefined): string {
  if (!user) return '';
  return [user.firstName, user.lastName].join(' ');
}
