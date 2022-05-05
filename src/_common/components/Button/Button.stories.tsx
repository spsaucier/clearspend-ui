import { For, type JSXElement } from 'solid-js';
import { keys } from 'solid-create-form/lib/utils';

import { FlatButton, FlatButtonProps } from 'signup/components/Button';

import { IconName } from '../Icon';

import { Button, ButtonProps } from './Button';

const TYPES: ButtonProps['type'][] = ['default', 'primary', 'danger'];
const VIEWS: ButtonProps['view'][] = ['default', 'second', 'ghost'];
const SIZES: ButtonProps['size'][] = ['lg', 'md', 'sm'];

export default {
  title: 'Common/Button',
  component: Button,
  argTypes: {
    icon: {
      options: [...keys(IconName)].sort(),
      control: { type: 'select' },
    },
    children: { control: { type: 'text' } },
    loading: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
  args: {
    children: 'Button',
    loading: false,
    disabled: false,
  },
};

function mapRender(
  render: (view: ButtonProps['view'], type: ButtonProps['type'], size: ButtonProps['size']) => JSXElement,
) {
  return (
    <div>
      <For each={VIEWS}>
        {(view) => (
          <div style={{ display: 'flex', 'flex-direction': 'column', gap: '26px' }}>
            <For each={TYPES}>
              {(type) => (
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    'justify-content': 'center',
                    'align-items': 'center',
                  }}
                >
                  <For each={SIZES}>
                    {(size) => (
                      <span style={{ 'margin-right': '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>{render(view, type, size)}</div>
                        <div style={{ 'margin-top': '10px' }}>
                          {view} - {type} - {size}
                        </div>
                      </span>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

export const Default = (args: ButtonProps) =>
  mapRender((view, type, size) => (
    <>
      <Button {...args} size={size} type={type} view={view} />
      <Button {...args} size={size} type={type} view={view} href="#">
        Link
      </Button>
    </>
  ));

export const Flat = (args: FlatButtonProps) =>
  mapRender((view, type, size) => (
    <>
      <FlatButton {...args} size={size} type={type} view={view} />
      <FlatButton {...args} size={size} type={type} view={view} href="#">
        Link
      </FlatButton>
    </>
  ));
