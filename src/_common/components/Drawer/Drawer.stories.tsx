import { Drawer, DrawerProps } from './Drawer';

export default {
  title: 'Common/Drawer',
  component: Drawer,
  argTypes: {
    title: { control: { type: 'text' } },
    noPadding: { control: { type: 'boolean' } },
    darkMode: { control: { type: 'boolean' } },
  },
  args: {
    title: 'Some Title',
    noPadding: false,
    darkMode: false,
  },
};

export const Default = (args: DrawerProps) => (
  <div>
    <Drawer {...args} open>
      <div>Content...</div>
    </Drawer>
  </div>
);
