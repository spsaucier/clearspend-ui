import { CardType } from 'cards/types';

import { Card, CardProps } from './Card';

export default {
  title: 'Finance/Card',
  component: Card,
  argTypes: {
    type: {
      options: CardType,
      control: { type: 'radio' },
    },
    number: { control: { type: 'number' } },
    name: { control: { type: 'text' } },
    allocation: { control: { type: 'text' } },
    details: { control: { type: 'text' } },
    balance: { control: { type: 'number' } },
  },
  args: {
    type: CardType.VIRTUAL,
    name: 'Renaud Béranger',
    allocation: 'Marketing Q1 2022 (Advertisement)',
    number: 4056232515578984,
    balance: 4586.3,
  },
};

export const Default = (args: CardProps) => <Card {...args} />;
