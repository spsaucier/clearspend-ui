import { createSignal } from 'solid-js';

import { shiftDate } from '../../api/dates';

import { SelectDateRange, SelectDateRangeProps } from './SelectDateRange';

export default {
  title: 'Common/SelectDateRange',
  component: SelectDateRange,
  argTypes: {
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    error: false,
    disabled: false,
  },
};

export const Default = (args: SelectDateRangeProps) => {
  const today: ReadonlyDate = new Date();
  const [value, setValue] = createSignal<ReadonlyDate[]>([]);

  const onChange = (dates: ReadonlyDate[]) => {
    setValue(dates);
    args.onChange(dates);
  };

  return (
    <div>
      <SelectDateRange
        {...args}
        minDate={shiftDate(today, { months: -6 })}
        maxDate={today}
        value={value()}
        onChange={onChange}
      />
    </div>
  );
};
