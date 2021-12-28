import { createSignal } from 'solid-js';

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

export const Default = (args: InputDateProps) => {
  const [value, setValue] = createSignal(args.value);

  const onChange = (date: ReadonlyDate | undefined) => {
    setValue(date);
    args.onChange?.(date);
  };

  return (
    <div>
      <InputDate {...args} value={value()} onChange={onChange} />
    </div>
  );
};
