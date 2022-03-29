import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { Input } from '../Input';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Checkbox } from '../Checkbox';
import { Divider } from '../Divider';
import { Select, SelectState, Option } from '../Select';
import { InputPhone } from '../InputPhone';
import { InputCode } from '../InputCode';
import { InputDate } from '../InputDate';

import { FormItem } from './FormItem';

export default {
  title: 'Composite/Form',
  component: FormItem,
};

export const KeyboardAccessibility = () => {
  const [selectValue, setSelectValue] = createSignal('');
  const [state, setState] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [date, setDate] = createSignal<ReadonlyDate | undefined>();

  return (
    <div style={{ 'max-width': '400px' }}>
      <Text message="Use your keyboard to tab through and fill out this form." />
      <FormItem>
        <Input placeholder="Text field" />
      </FormItem>
      <FormItem>
        {/* eslint-disable-next-line no-empty-function */}
        <InputCode codeLength={6} value={''} onChange={() => {}} />
      </FormItem>
      <FormItem>
        <SelectState value={state()} onChange={setState} />
      </FormItem>
      <FormItem>
        <InputDate value={date()} onChange={setDate} />
      </FormItem>
      <FormItem>
        <InputPhone placeholder="Mobile" value={phone()} onChange={setPhone} />
      </FormItem>
      <FormItem>
        <Select
          valueRender={(val, txt) => `${txt} (${val})`}
          value={selectValue()}
          onChange={setSelectValue}
          placeholder="Choose allocation"
        >
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
