import { Input, InputProps } from './Input';

export default {
  title: 'Common/Input',
  component: Input,
  argTypes: {
    value: { control: { type: 'text' } },
    type: {
      control: { type: 'radio' },
      options: ['text', 'password'],
    },
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: '',
    type: 'text',
    placeholder: 'Placeholder...',
    error: false,
    disabled: false,
  },
};

export const Default = (args: InputProps) => <Input {...args} />;
