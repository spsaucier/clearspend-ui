import { Switch, SwitchProps } from './Switch';

export default {
  title: 'Common/Switch',
  component: Switch,
  argTypes: {
    value: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
    onChange: { action: 'changed', table: { disable: true } },
  },
  args: {
    value: false,
    disabled: false,
    children: '',
  },
};

export const Default = (args: SwitchProps) => <Switch {...args} />;
