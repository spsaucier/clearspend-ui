import { mergeProps, createMemo, Accessor, Show } from 'solid-js';
import type { JSX } from 'solid-js';

import { Icon, IconName } from '../Icon';
import { Spin } from '../Spin';
import { join } from '../../utils/join';
import { isString } from '../../utils/isString';

import css from './Button.css';

type IconType = keyof typeof IconName;

export interface IconProps {
  name: IconType;
  pos: 'left' | 'right';
  class?: string;
}

export interface ButtonProps {
  id?: string;
  type?: 'default' | 'primary' | 'danger';
  view?: 'default' | 'second' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconType | Readonly<IconProps>;
  class?: string;
  wide?: boolean;
  href?: string;
  download?: string;
  loading?: boolean;
  disabled?: boolean;
  htmlType?: 'button' | 'submit';
  children?: JSX.Element;
  onClick?: (event: MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Button(props: Readonly<ButtonProps>) {
  const merged = mergeProps({ type: 'default', view: 'default', size: 'md', htmlType: 'button' }, props);

  const icon: Accessor<Readonly<IconProps> | undefined> = createMemo(() => {
    if (!merged.icon) return undefined;
    return isString(merged.icon) ? { name: merged.icon, pos: 'left' } : merged.icon;
  });

  const iconEl = createMemo(() => {
    const iProps = icon();
    return iProps ? <Icon name={iProps.name} class={join(css.icon, iProps.class)} /> : null;
  });

  const spinEl = <Spin class={css.spin} />;
  const isButton = createMemo(() => typeof merged.href !== 'string');

  const sharedProps = createMemo<Partial<Readonly<ButtonProps>>>(() => ({
    id: merged.id,
    class: join(css.root, merged.class),
    classList: {
      [css.wide!]: merged.wide,
      [css.sm!]: merged.size === 'sm',
      [css.lg!]: merged.size === 'lg',

      [css.ghost!]: merged.type === 'default' && merged.view === 'ghost',

      [css.primary!]: merged.type === 'primary' && merged.view === 'default',
      [css.primarySecond!]: merged.type === 'primary' && merged.view === 'second',
      [css.primaryGhost!]: merged.type === 'primary' && merged.view === 'ghost',

      [css.danger!]: merged.type === 'danger' && merged.view === 'default',
      [css.dangerSecond!]: merged.type === 'danger' && merged.view === 'second',
      [css.dangerGhost!]: merged.type === 'danger' && merged.view === 'ghost',

      [css.iconOnly!]: Boolean(icon()) && !merged.children,
      [css.disabled!]: !isButton() && merged.disabled,
      [css.loading!]: merged.loading,
    },
    onClick: merged.onClick,
    onMouseEnter: merged.onMouseEnter,
    onMouseLeave: merged.onMouseLeave,
  }));

  const content = createMemo(() => (
    <>
      {icon()?.pos === 'left' && (!merged.loading ? iconEl : spinEl)}
      {props.children && (
        <span classList={{ [css.noIcon!]: !icon() && merged.loading }}>
          <span class={css.child}>{props.children}</span>
          {!icon() && merged.loading && <span class={css.absolute}>{spinEl}</span>}
        </span>
      )}
      {icon()?.pos === 'right' && (!merged.loading ? iconEl : spinEl)}
    </>
  ));

  return (
    <Show
      when={isButton()}
      fallback={
        <a {...sharedProps()} href={merged.href} download={merged.download}>
          {content}
        </a>
      }
    >
      <button {...sharedProps()} type={merged.htmlType} disabled={merged.disabled}>
        {content}
      </button>
    </Show>
  );
}
