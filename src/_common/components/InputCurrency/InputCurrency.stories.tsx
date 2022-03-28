import { InputCurrency, type InputCurrencyProps } from './InputCurrency';

export default {
  title: 'Common/InputCurrency',
  component: InputCurrency,
  argTypes: {
    value: { control: { type: 'text' } },
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

export const Default = (args: InputCurrencyProps) => <InputCurrency {...args} />;
