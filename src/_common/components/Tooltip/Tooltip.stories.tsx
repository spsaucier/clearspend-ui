import type { JSX } from 'solid-js';

import { Button } from '../Button';

import { Tooltip, TooltipProps, TooltipFuncProps } from './Tooltip';

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
  },
  args: {
    message: 'Tooltip text',
    children: (props: TooltipFuncProps) => <Button {...props}>Hover Me 😎</Button>,
  },
};

export const Default = (args: TooltipProps) => (
  <div style={WRAPPER_STYLES}>
    <Tooltip {...args} />
  </div>
);
