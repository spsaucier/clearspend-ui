import { mergeProps, createMemo, Accessor, Show } from 'solid-js';
import type { JSX } from 'solid-js';

import { Icon, IconName } from '../Icon';
import { Spin } from '../Spin';
import { join } from '../../utils/join';
import { isString } from '../../utils/isString';

import css from './Button.css';

export type IconType = keyof typeof IconName;

export interface IconProps {
  name: IconType;
  pos: 'left' | 'right';
  class?: string;
}

export interface ButtonProps {
  id?: string;
  type?: 'default' | 'primary' | 'danger';
  view?: 'default' | 'second' | 'ghost' | 'outline';
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
  target?: string;
  'data-name'?: string;
}

export function Button(props: Readonly<ButtonProps>) {
  const merged = mergeProps(
    { type: 'default' as const, view: 'default' as const, size: 'md' as const, htmlType: 'button' as const },
    props,
  );

  const icon: Accessor<Readonly<IconProps> | undefined> = createMemo(() => {
    if (!merged.icon) return undefined;
    return isString(merged.icon) ? { name: merged.icon, pos: 'left' as const } : merged.icon;
  });

  const iconEl = createMemo(() => {
    const iProps = icon();
    return iProps ? <Icon name={iProps.name} class={join(css.icon, iProps.class)} /> : null;
  });

  const spinEl = <Spin class={css.spin} />;
  const isButton = createMemo(() => typeof merged.href !== 'string');
  const isIconOnly = createMemo(() => Boolean(icon()) && !merged.children);

  const sharedProps = createMemo<Partial<Readonly<ButtonProps>>>(() => ({
    id: merged.id,
    class: join(css.root, merged.class),
    classList: {
      [css.wide!]: merged.wide,
      [css.sm!]: merged.size === 'sm',
      [css.lg!]: merged.size === 'lg',

      [css.ghost!]: merged.type === 'default' && merged.view === 'ghost',
      [css.outline!]: merged.type === 'default' && merged.view === 'outline',

      [css.primary!]: merged.type === 'primary' && merged.view === 'default',
      [css.primarySecond!]: merged.type === 'primary' && merged.view === 'second',
      [css.primaryGhost!]: merged.type === 'primary' && merged.view === 'ghost',

      [css.danger!]: merged.type === 'danger' && merged.view === 'default',
      [css.dangerSecond!]: merged.type === 'danger' && merged.view === 'second',
      [css.dangerGhost!]: merged.type === 'danger' && merged.view === 'ghost',

      [css.iconOnly!]: isIconOnly(),
      [css.iconOnlySm!]: isIconOnly() && merged.size === 'sm',
      [css.iconOnlyLg!]: isIconOnly() && merged.size === 'lg',

      [css.disabled!]: !isButton() && merged.disabled,
      [css.loading!]: merged.loading,
    },
    onClick: merged.onClick,
    onMouseEnter: merged.onMouseEnter,
    onMouseLeave: merged.onMouseLeave,
    target: merged.target,
    'data-name': merged['data-name'],
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
