import type { JSX } from 'solid-js';

import { Button } from '../Button';

import { Tooltip, TooltipProps, TooltipFuncProps, DEFAULT_ENTER_DELAY, DEFAULT_LEAVE_DELAY } from './Tooltip';

const WRAPPER_STYLES: JSX.CSSProperties = {
  position: 'absolute',
  width: 'calc(100% - 2rem)',
  height: 'calc(100% - 2rem)',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
};

export default {
  title: 'Common/Tooltip',
  component: Tooltip,
  argTypes: {
    children: { table: { disable: true } },
    enterDelay: { control: { type: 'number' } },
    leaveDelay: { control: { type: 'number' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    message: 'Tooltip text',
    children: (props: TooltipFuncProps) => <Button {...props}>Hover Me 😎</Button>,
    enterDelay: DEFAULT_ENTER_DELAY,
    leaveDelay: DEFAULT_LEAVE_DELAY,
    disabled: false,
  },
};

export const Default = (args: TooltipProps) => (
  <>
    <Tooltip {...args} />
    <div style={WRAPPER_STYLES}>
      <Tooltip {...args} />
    </div>
  </>
);
