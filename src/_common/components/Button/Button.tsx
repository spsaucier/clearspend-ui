import { mergeProps, createMemo, Accessor } from 'solid-js';
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
}

export interface ButtonProps {
  id?: string;
  type?: 'default' | 'primary';
  inverse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: IconType | Readonly<IconProps>;
  class?: string;
  wide?: boolean;
  loading?: boolean;
  disabled?: boolean;
  htmlType?: 'button' | 'submit';
  children?: JSX.Element;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Button(props: Readonly<ButtonProps>) {
  const merged = mergeProps({ type: 'default', size: 'md', htmlType: 'button' }, props);

  const icon: Accessor<Readonly<IconProps> | undefined> = createMemo(() => {
    if (!merged.icon) return undefined;
    return isString(merged.icon) ? { name: merged.icon, pos: 'left' } : merged.icon;
  });

  const iconEl = icon() && <Icon name={icon()!.name} class={css.icon} />;
  const spinEl = <Spin class={css.spin} />;

  return (
    <button
      id={merged.id}
      type={merged.htmlType}
      disabled={merged.disabled}
      class={join(
        css.root,
        merged.type === 'primary' && (!merged.inverse ? css.primary : css.primaryInverse),
        merged.class,
      )}
      classList={{
        [css.wide!]: merged.wide,
        [css.sm!]: merged.size === 'sm',
        [css.lg!]: merged.size === 'lg',
        [css.inverse!]: merged.type === 'default' && merged.inverse,
        [css.iconOnly!]: Boolean(icon()) && !merged.children,
        [css.loading!]: merged.loading,
      }}
      onClick={merged.onClick}
      onMouseEnter={merged.onMouseEnter}
      onMouseLeave={merged.onMouseLeave}
    >
      {icon()?.pos === 'left' && (!merged.loading ? iconEl : spinEl)}
      {props.children && (
        <span classList={{ [css.noIcon!]: !icon() && merged.loading }}>
          <span class={css.child}>{props.children}</span>
          {!icon() && merged.loading && <span class={css.absolute}>{spinEl}</span>}
        </span>
      )}
      {icon()?.pos === 'right' && (!merged.loading ? iconEl : spinEl)}
    </button>
  );
}
