import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './types';

export default {
  title: 'Common/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: { type: 'boolean' } },
    indeterminate: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    children: 'Checkbox',
  },
};

export const Default = (args: CheckboxProps<string>) => <Checkbox {...args} />;
