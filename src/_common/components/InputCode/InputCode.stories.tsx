import { InputCode, InputCodeProps } from './InputCode';

export default {
  title: 'Common/InputCode',
  component: InputCode,
  argTypes: {
    value: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    value: '',
    error: false,
    disabled: false,
  },
};

export const Default = (args: InputCodeProps) => <InputCode {...args} />;
