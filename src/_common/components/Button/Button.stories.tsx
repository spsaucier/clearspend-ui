import { keys } from '../../utils/keys';
import { IconName } from '../Icon';

import { Button, ButtonProps } from './Button';

export default {
  title: 'Common/Button',
  component: Button,
  argTypes: {
    icon: {
      options: [...keys(IconName)].sort(),
      control: { type: 'select' },
    },
    loading: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
  args: {
    loading: false,
    disabled: false,
  },
};

export const Default = (args: ButtonProps) => <Button {...args}>Button</Button>;
