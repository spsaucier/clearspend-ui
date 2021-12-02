import { Fault, FaultProps } from './Fault';

export default {
  title: 'Common/Fault',
  component: Fault,
  argTypes: {
    onReload: { action: 'Reload clicked', table: { disable: true } },
  },
  args: {},
};

export const Default = (args: FaultProps) => <Fault {...args} />;
