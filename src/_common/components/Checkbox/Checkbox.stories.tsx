import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './types';

export default {
  title: 'Common/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    children: 'Checkbox',
  },
};

export const Default = (args: CheckboxProps) => <Checkbox {...args} />;
