import { For } from 'solid-js';

import { USA_STATES } from 'onboarding/constants/usa';
import { keys } from '_common/utils/keys';

import { Select } from './Select';
import { Option } from './Option';
import type { SelectProps } from './types';

type SelectStateProps = Omit<SelectProps, 'children'>;

export function SelectState(props: SelectStateProps) {
  return (
    <Select name="state" placeholder="Choose state" {...props}>
      <For each={keys(USA_STATES)}>{(item) => <Option value={item}>{USA_STATES[item]!}</Option>}</For>
    </Select>
  );
}
