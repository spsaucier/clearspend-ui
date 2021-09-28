import type { JSX } from 'solid-js';

import { Button } from '../Button';

import { Popover, PopoverProps } from './Popover';
import type { FuncProps } from './types';

const WRAPPER_STYLES: JSX.CSSProperties = {
  position: 'absolute',
  width: 'calc(100% - 2rem)',
  height: 'calc(100% - 2rem)',
  display: 'flex',
  'flex-direction': 'column',
  'justify-content': 'space-between',
};

const ROW_STYLES: JSX.CSSProperties = {
  display: 'flex',
  'justify-content': 'space-between',
};

export default {
  title: 'Common/Popover',
  component: Popover,
  argTypes: {
    content: { control: { type: 'text' } },
    balloon: { control: { type: 'boolean' } },
    children: { table: { disable: true } },
  },
  args: {
    content: 'Content...',
    children: (props: FuncProps) => <Button {...props}>Click Me!</Button>,
  },
};

export const Default = (args: PopoverProps) => (
  <div style={WRAPPER_STYLES}>
    <div style={ROW_STYLES}>
      <Popover {...args} />
      <Popover {...args} position="bottom-center" />
      <Popover {...args} position="bottom-right" />
    </div>
    <div style={ROW_STYLES}>
      <Popover {...args} position="top-left" />
      <Popover {...args} position="top-center" />
      <Popover {...args} position="top-right" />
    </div>
  </div>
);
