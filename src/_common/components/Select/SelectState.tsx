import { For } from 'solid-js';

import { USA_STATES } from 'onboarding/constants/usa';
import { keys } from '_common/utils/keys';

import { Select } from './Select';
import { Option } from './Option';
import type { SelectProps } from './types';

type SelectStateProps = Omit<SelectProps, 'children'>;

export function SelectState(props: SelectStateProps) {
  return (
    <Select
      onBlur={(e) => {
        // We are capturing the blur event from autofill here, calling the change event.
        // In this scenario, the blur event is called, even though the input field
        // may not actually be blurred. We therefore explicitly blur, so that dropdown
        // fields are removed.
        props.onChange?.(e.currentTarget.value);
        e.currentTarget.blur();
      }}
      name="state"
      placeholder="Choose state"
      {...props}
    >
      <For each={keys(USA_STATES)}>{(item) => <Option value={item}>{USA_STATES[item]!}</Option>}</For>
    </Select>
  );
}
