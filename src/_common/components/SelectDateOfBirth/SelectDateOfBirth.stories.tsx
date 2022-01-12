import { SelectDateOfBirth, SelectDateOfBirthProps } from './SelectDateOfBirth';

export default {
  title: 'Common/SelectDateOfBirth',
  component: SelectDateOfBirth,
  argTypes: {
    value: { control: { type: 'date' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: undefined,
    error: false,
    disabled: false,
  },
};

export const Default = (props: SelectDateOfBirthProps) => {
  return <SelectDateOfBirth {...props} value={props.value ? new Date(props.value as unknown as number) : undefined} />;
};
