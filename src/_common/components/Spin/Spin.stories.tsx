import { Spin, SpinProps } from './Spin';

export default {
  title: 'Common/Spin',
  component: Spin,
  argTypes: {},
};

export const Default = (args: SpinProps) => <Spin {...args} />;
