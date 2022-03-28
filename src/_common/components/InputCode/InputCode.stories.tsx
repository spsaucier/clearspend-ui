import { InputCode, InputCodeProps } from './InputCode';

export default {
  title: 'Common/InputCode',
  component: InputCode,
  argTypes: {
    value: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    codeLength: { control: { type: 'number' } },
  },
  args: {
    value: '',
    error: false,
    disabled: false,
    codeLength: 6,
  },
};

export const Default = (args: InputCodeProps) => <InputCode {...args} />;
