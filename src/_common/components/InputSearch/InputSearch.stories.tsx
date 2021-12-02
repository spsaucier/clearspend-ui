import { InputSearch, InputSearchProps } from './InputSearch';

export default {
  title: 'Common/InputSearch',
  component: InputSearch,
  argTypes: {
    value: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
    onSearch: { action: 'searched', table: { disable: true } },
    delay: { control: { type: 'number' } },
  },
  args: {
    value: '',
    type: 'text',
    placeholder: 'Search...',
    error: false,
    disabled: false,
    delay: 300,
  },
};

export const Default = (args: InputSearchProps) => <InputSearch {...args} />;
