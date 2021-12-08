import { Text } from 'solid-i18n';

import { Input } from '../Input';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Checkbox } from '../Checkbox';
import { Divider } from '../Divider';
import { Select, SelectState, Option } from '../Select';
import { InputPhone } from '../InputPhone';
import { InputCode } from '../InputCode';

import { FormItem } from './FormItem';

export default {
  title: 'Composite/Form',
  component: FormItem,
  argTypes: {
    label: { control: { type: 'text' } },
    extra: { control: { type: 'text' } },
    error: { control: { type: 'text' } },
  },
  args: {
    label: 'Label',
    extra: 'Description',
    error: '',
  },
};

export const KeyboardAccessibility = () => {
  return (
    <div style={{ 'max-width': '400px' }}>
      <Text message="Use your keyboard to tab through and fill out this form." />
      <FormItem>
        <Input placeholder="Text field" />
      </FormItem>
      <FormItem>
        {/* eslint-disable-next-line no-empty-function */}
        <InputCode value={''} onChange={() => {}} />
      </FormItem>
      <FormItem>
        <SelectState />
      </FormItem>
      <FormItem>
        <InputPhone placeholder="Phone" />
      </FormItem>
      <FormItem>
        <Select valueRender={(val, txt) => `${txt} (${val})`} placeholder="Choose allocation">
          <Option value="MKT">Marketing</Option>
          <Option value="SAL">Sales</Option>
          <Divider />
          <Option value="ALL">All allocations</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Switch />
      </FormItem>
      <FormItem>
        <Checkbox />
      </FormItem>
      <Button>Submit</Button>
    </div>
  );
};
