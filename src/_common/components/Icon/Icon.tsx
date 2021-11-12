/* eslint-disable import/dynamic-import-chunkname */

import { createSignal, createEffect, createMemo, JSX } from 'solid-js';
import { template, spread } from 'solid-js/web';

import { join } from '../../utils/join';

import type { IconName } from './types';

import css from './Icon.css';

const SIZE = 24;

interface SVGModule {
  default: string;
}

export interface IconProps {
  name: keyof typeof IconName;
  size?: 'md' | 'sm' | 'xs';
  class?: string;
  style?: JSX.CSSProperties;
}

export function Icon(props: Readonly<IconProps>) {
  const [icon, setIcon] = createSignal<Readonly<SVGModule> | null>(null);

  createEffect(() => {
    import(/* webpackChunkName: "icon-[request]" */ `./icons/${props.name}.svg`).then((module) => {
      setIcon(module);
    });
  });

  const classes = createMemo(() =>
    join(css.root, props.size === 'sm' && css.sm, props.size === 'xs' && css.xs, props.class),
  );

  return createMemo(() => {
    if (!icon()) return <span class={classes()} />;

    const el = template(icon()!.default, 0);

    spread(
      el,
      {
        viewBox: `0 0 ${SIZE} ${SIZE}`,
        'aria-label': `icon: ${props.name}`,
        class: classes(),
        style: props.style,
      },
      true,
    );

    return el;
  });
}
