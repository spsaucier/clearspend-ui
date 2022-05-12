import { createMemo } from 'solid-js';

import type { Card } from 'generated/capital';

import { CardType } from '../../types';

import css from './CardIcon.css';

interface CardIconProps {
  type: CardType;
  status: Card['status'];
}

export function CardIcon(props: Readonly<CardIconProps>) {
  const isCancelled = createMemo(() => props.status === 'CANCELLED');
  const isPhysical = createMemo(() => props.type === CardType.PHYSICAL);

  return (
    <svg width="24" height="15" fill="none" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg" class={css.root}>
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="-9" x2="0" y2="40">
        <stop offset="0" stop-color="#fff" />
        <stop offset=".5" stop-color="#dcffe6" />
        <stop offset="1" stop-color="#afffc6" />
      </linearGradient>
      <path fill={isCancelled() ? '#000' : isPhysical() ? '#5bea83' : 'url(#b)'} d="M0 0h24v15H0z" />
      <path
        fill={isCancelled() ? '#555' : isPhysical() ? '#000' : '#afffc6'}
        opacity={isPhysical() ? '0.1' : '0.7'}
        d={
          'm12.9 9 .6.3c.2.1.5 0 .7-.1L16.8 8a40.7 40.7 0 0 0-4.9-3.1c-5.5-3-9-3.2-11.9-2.8v1.4c2.3.2 5 ' +
          '1 8.6 2.9 1.5.8 2.9 1.6 4.3 2.6zm4-1.1c-.1.1 0 .1 0 0zM3.7 7.5l2.7-1.2h.1A26.1 26.1 0 0 0 0 ' +
          '4.1v2.4l2.2.9c.5.3 1 .3 1.5.1zm17-2.1c-1.4-1-2.8-1.8-4.2-2.6A22.4 22.4 0 0 0 8.9 0H5.4L5 .2 ' +
          '2.3 1.4c2.7-.2 6 .3 10.8 2.9 1.7.9 3.4 2 4.9 3.1l2.7-1.2c.2-.1.6-.4 0-.8zM0 10.7C2.3 12 4.4 ' +
          '13.5 6.2 15h5A37 37 0 0 0 0 7.6v3.1zm8.5-3.3-.8-.2-.7.1-2.7 1.2c3.7 2 6.4 4.2 8.7 ' +
          '6.5h4.8c-2.7-3-5.9-5.5-9.3-7.6zM4.8 0h-.2C3 .2 1.5.7 0 1v.8l1.2-.2L4.8 0zM0 15h4.4L0 ' +
          '11.9V15zM3.1 0H0v.7C1 .6 1.9.4 2.8.1l.3-.1z'
        }
      />
    </svg>
  );
}
