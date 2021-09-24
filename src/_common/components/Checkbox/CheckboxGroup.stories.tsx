import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import type { CheckboxGroupProps } from './types';

export default {
  title: 'Common/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
};

export const Default = (args: CheckboxGroupProps) => (
  <CheckboxGroup {...args}>
    <Checkbox value="red">Red</Checkbox>
    <Checkbox value="green">Green</Checkbox>
    <Checkbox value="blue" disabled>
      Blue
    </Checkbox>
  </CheckboxGroup>
);
