import type { InputProps } from '../Input';

import { InputPercentage } from './InputPercentage';

export default {
  title: 'Common/InputPercentage',
  component: InputPercentage,
  argTypes: {
    value: { control: { type: 'number' } },
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: '',
    placeholder: 'Enter amount',
    error: false,
    disabled: false,
  },
};

export const Default = (args: InputProps) => <InputPercentage {...args} />;
