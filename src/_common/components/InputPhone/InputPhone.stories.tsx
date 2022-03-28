import type { InputProps } from '../Input';

import { InputPhone } from './InputPhone';

export default {
  title: 'Common/InputPhone',
  component: InputPhone,
  argTypes: {
    value: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: '',
    type: 'text',
    placeholder: 'Enter Phone',
    error: false,
    disabled: false,
  },
};

export const Default = (args: InputProps) => <InputPhone {...args} />;
