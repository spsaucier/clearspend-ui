import { Divider } from '../Divider';
import { Button } from '../Button';

import { Dropdown, DropdownProps } from './Dropdown';
import { MenuItem } from './MenuItem';

export default {
  title: 'Common/Dropdown',
  component: Dropdown,
  argTypes: {},
  args: {},
};

export const Default = (args: DropdownProps) => (
  <div>
    <Dropdown
      {...args}
      menu={
        <>
          <MenuItem>One</MenuItem>
          <MenuItem>Two</MenuItem>
          <Divider />
          <MenuItem disabled>Other</MenuItem>
        </>
      }
    >
      <Button>Click Me!</Button>
    </Dropdown>
  </div>
);
