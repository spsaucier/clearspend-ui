import { JSX, For } from 'solid-js';

import { keys } from '../../utils/keys';

import { Icon, IconProps } from './Icon';
import { IconName } from './types';

const ALL_ICONS_STYLES: JSX.CSSProperties = {
  display: 'flex',
  'flex-wrap': 'wrap',
};

const ICON_STYLE: JSX.CSSProperties = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'center',
  width: '100px',
  padding: '10px',
  margin: '2px',
  'font-size': '7px',
  background: '#fff',
  border: '1px solid rgba(0, 0, 0, .15)',
  'border-radius': '10px',
  cursor: 'pointer',
};

function copy(name: string) {
  return () => {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.value = name;
    document.body.appendChild(input);
    input.focus();
    input.select();
    document.execCommand('copy');
    input.remove();
  };
}

export default {
  title: 'Common/Icon',
  component: Icon,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['md', 'sm', 'xs'],
    },
    color: {
      control: { type: 'color' },
      description: 'The component does not have this property (it is only for color checking).',
    },
  },
  args: {
    size: 'md',
    color: '#000000',
  },
};

export const Default = (args: IconProps & { color: string }) => (
  <div style={ALL_ICONS_STYLES}>
    <For each={[...keys(IconName)].sort()}>
      {(name) => (
        <div style={ICON_STYLE} onClick={copy(name)}>
          <Icon size={args.size} name={name} style={{ color: args.color }} />
          <div>{name}</div>
        </div>
      )}
    </For>
  </div>
);
