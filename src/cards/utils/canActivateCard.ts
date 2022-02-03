import type { Card, User } from 'generated/capital';

export function canActivateCard(card: Readonly<Card>, user: Readonly<User>) {
  return user.type === 'BUSINESS_OWNER' || user.userId === card.userId;
}
