import type { Card, User } from 'generated/capital';

export function canActivateCard(card: Readonly<Card>, user: Readonly<User>) {
  return user.userId === card.userId && card.status !== 'CANCELLED';
}
