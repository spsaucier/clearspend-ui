import { keys } from '../../utils/keys';
import { IconName } from '../Icon';

import { Button, ButtonProps } from './Button';

export default {
  title: 'Common/Button',
  component: Button,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    type: {
      options: ['default', 'primary', 'danger'],
      control: { type: 'radio' },
    },
    view: {
      options: ['default', 'second', 'ghost'],
      control: { type: 'radio' },
    },
    icon: {
      options: [...keys(IconName)].sort(),
      control: { type: 'select' },
    },
    children: { control: { type: 'text' } },
    loading: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
  args: {
    size: 'md',
    type: 'default',
    view: 'default',
    children: 'Button',
    loading: false,
    disabled: false,
  },
};

export const Default = (args: ButtonProps) => <Button {...args} />;
