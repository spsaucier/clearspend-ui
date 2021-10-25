import { createSignal } from 'solid-js';

import { Divider } from '../Divider';

import { Select } from './Select';
import { Option } from './Option';
import type { SelectProps } from './types';

export default {
  title: 'Common/Select',
  component: Select,
  argTypes: {
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    placeholder: 'Placeholder...',
    error: false,
    disabled: false,
  },
};

export const Default = (args: SelectProps) => {
  const [value, onChange] = createSignal<string>();

  return (
    <div>
      <Select {...args} value={value()} onChange={onChange}>
        <Option value="one">One</Option>
        <Option value="two">Two</Option>
        <Option value="other" disabled>
          Other
        </Option>
      </Select>
    </div>
  );
};

export const CustomValueRender = (args: SelectProps) => {
  const [value, onChange] = createSignal<string>();

  return (
    <div>
      <Select {...args} value={value()} valueRender={(val, txt) => `${txt} (${val})`} onChange={onChange}>
        <Option value="MKT">Marketing</Option>
        <Option value="SAL">Sales</Option>
        <Divider />
        <Option value="ALL">All allocations</Option>
      </Select>
    </div>
  );
};
