import { Input } from '../Input';

import { FormItem, FormItemProps } from './FormItem';

export default {
  title: 'Common/FormItem',
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

export const Default = (args: FormItemProps) => (
  <div>
    <FormItem {...args}>
      <Input />
    </FormItem>
    <FormItem label="Empty">
      <Input />
    </FormItem>
    <FormItem label="With error" error="Error text...">
      <Input />
    </FormItem>
  </div>
);
