import { createSignal, For } from 'solid-js';

import { MultiSelect } from './MultiSelect';
import { Option } from './Option';
import type { MultiSelectProps } from './types';

export default {
  title: 'Common/MultiSelect',
  component: MultiSelect,
  argTypes: {
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    placeholder: 'Search...',
    error: false,
    disabled: false,
  },
};

export const Default = (args: MultiSelectProps) => {
  const [value, onChange] = createSignal<string[]>([]);
  const options = [
    {
      value: 'mkt',
      text: 'Marketing',
    },
    {
      value: 'mkt-office',
      text: 'Marketing Office Supplies',
    },
    {
      value: 'q2-mkt',
      text: 'Q2 Marketing',
    },
    {
      value: 'q4-mkt',
      text: 'Q4 Marketing',
    },
  ];

  return (
    <div>
      <MultiSelect
        {...args}
        value={value()}
        onChange={onChange}
        valueRender={(v) => options.find((o) => o.value === v)?.text}
      >
        <For each={options}>
          {(o) => {
            return <Option value={o.value}>{o.text}</Option>;
          }}
        </For>
      </MultiSelect>
    </div>
  );
};
