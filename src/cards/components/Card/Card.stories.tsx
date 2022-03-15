import { CardType } from 'cards/types';

import { Card, CardProps } from './Card';

export default {
  title: 'Finance/Card',
  component: Card,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: Object.keys(CardType),
    },
    number: { control: { type: 'text' } },
    status: {
      control: { type: 'radio' },
      options: ['ACTIVE', 'INACTIVE'],
    },
    activated: { control: { type: 'boolean' } },
  },
  args: {
    type: CardType.PHYSICAL,
    number: '4056232515578984',
    status: 'ACTIVE',
    activated: true,
  },
};

export const Default = (args: CardProps) => <Card {...args} />;
