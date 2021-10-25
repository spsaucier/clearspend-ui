import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupProps } from './types';

export default {
  title: 'Common/RadioGroup',
  component: RadioGroup,
  argTypes: {
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
};

export const Default = (args: RadioGroupProps) => (
  <RadioGroup {...args} name="group-name">
    <Radio value="red">Red</Radio>
    <Radio value="green">Green</Radio>
    <Radio value="blue" disabled>
      Blue
    </Radio>
  </RadioGroup>
);
