import { createMemo, mergeProps } from 'solid-js';

import { Button, ButtonProps, IconProps, IconType } from '_common/components/Button/Button';

import css from './FlatButton.css';

const NO_ICON = null;
const DEFAULT_ICON: IconProps = { name: 'arrow-right', pos: 'right' };

export interface FlatButtonProps extends Omit<ButtonProps, 'icon'> {
  icon?: IconType | Readonly<IconProps> | typeof NO_ICON;
}

export function FlatButton(props: Readonly<FlatButtonProps>) {
  const merged: FlatButtonProps = mergeProps({ size: 'lg', icon: DEFAULT_ICON }, props);

  const icon = createMemo<IconType | IconProps | undefined>(() => (merged.icon === NO_ICON ? undefined : merged.icon));

  return (
    <Button {...merged} icon={icon()} class={css.root}>
      {props.children}
    </Button>
  );
}
