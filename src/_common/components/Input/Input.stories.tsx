import { Input, type InputProps, type TextAreaProps } from './Input';

export default {
  title: 'Common/Input',
  component: Input,
  argTypes: {
    value: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: '',
    placeholder: 'Placeholder...',
    error: false,
    disabled: false,
  },
};

export const Default = (args: InputProps) => <Input {...args} />;
export const TextArea = (args: TextAreaProps) => <Input {...args} useTextArea />;
