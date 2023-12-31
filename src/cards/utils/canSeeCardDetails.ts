import type { Card, User } from 'generated/capital';

export function canSeeCardDetails(card: Readonly<Card>, user: Readonly<User>) {
  return user.userId === card.userId;
}
