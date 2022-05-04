import { keys } from 'solid-create-form/lib/utils';
import { For } from 'solid-js';

import type { ButtonProps } from '_common/components/Button/Button';
import { IconName } from '_common/components/Icon';

import { FlatButton } from './FlatButton';

const ButtonTypes: ButtonProps['type'][] = ['default', 'primary', 'danger'];
const ButtonViews: ButtonProps['view'][] = ['default', 'second', 'ghost'];
const ButtonSizes: ButtonProps['size'][] = ['sm', 'md', 'lg'];

export default {
  title: 'Common/Button - FlatButton',
  component: FlatButton,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    type: {
      options: ['default', 'primary', 'danger'],
      control: { type: 'radio' },
    },
    view: {
      options: ['default', 'second', 'ghost'],
      control: { type: 'radio' },
    },
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
    size: 'md',
    type: 'default',
    view: 'default',
    children: 'Button',
    loading: false,
    disabled: false,
  },
};

export const Default = (args: ButtonProps) => (
  <div>
    <For each={ButtonViews}>
      {(view) => {
        return (
          <div>
            <For each={ButtonTypes}>
              {(type) => {
                return (
                  <div
                    style={{
                      'margin-bottom': '25px',
                      display: 'flex',
                      'grid-gap': '1=20px',
                      'justify-content': 'center',
                      'align-items': 'center',
                    }}
                  >
                    <For each={ButtonSizes}>
                      {(size) => {
                        return (
                          <span style={{ 'margin-right': '25px' }}>
                            <FlatButton {...args} size={size} type={type} view={view} />
                            &nbsp;&nbsp;&nbsp;
                            <FlatButton {...args} size={size} type={type} view={view} href="#">
                              Link
                            </FlatButton>
                            <div style={{ 'margin-top': '10px' }}>
                              {view} - {type} - {size}
                            </div>
                          </span>
                        );
                      }}
                    </For>
                  </div>
                );
              }}
            </For>
          </div>
        );
      }}
    </For>
  </div>
);
