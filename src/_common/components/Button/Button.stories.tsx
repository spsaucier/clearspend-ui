import { Button, ButtonProps } from './Button';

export default {
  title: 'Common/Button',
  component: Button,
  argTypes: {
    disabled: { control: { type: 'boolean' } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
};

export const Default = (args: ButtonProps) => <Button {...args}>Button</Button>;
