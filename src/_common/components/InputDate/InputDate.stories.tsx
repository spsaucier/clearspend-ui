import { InputDate, InputDateProps } from './InputDate';

export default {
  title: 'Common/InputDate',
  component: InputDate,
  argTypes: {
    value: { control: { type: 'date' } },
    error: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: undefined,
    error: false,
  },
};

export const Default = (args: InputDateProps) => (
  <div>
    <InputDate {...args} />
  </div>
);
