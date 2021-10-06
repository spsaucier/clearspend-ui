import { createSignal } from 'solid-js';

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
