import { createMemo, Show, Switch, Match } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { Card as ICard } from 'generated/capital';

import { formatAccountNumber } from '../../utils/formatAccountNumber';
import { CardType } from '../../types';

import css from './Card.css';

export interface CardProps {
  type: CardType;
  number?: string;
  name?: string;
  status?: Required<ICard>['status'];
  activated?: boolean;
  class?: string;
  onClick?: () => void;
}

export function Card(props: Readonly<CardProps>) {
  const i18n = useI18n();

  const isPhysical = createMemo(() => props.type === CardType.PHYSICAL);
  const isActivated = createMemo(() => props.activated !== false);
  const isFrozen = createMemo(() => isActivated() && props.status === 'INACTIVE');

  const opacity = createMemo(() => (isFrozen() ? '.1' : isActivated() ? '1' : '.2'));

  return (
    <svg
      width="306"
      height="194"
      viewBox="0 0 306 194"
      xmlns="http://www.w3.org/2000/svg"
      class={join(css.root, props.class)}
      onClick={props.onClick}
    >
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="47.7" y1="117.2" x2="347.2" y2="59.8">
        <stop offset="0" stop-color="#fff" />
        <stop offset="1" stop-color="#afffc6" />
      </linearGradient>
      <path fill={isFrozen() ? '#02302F' : isPhysical() ? '#43fa76' : 'url(#b)'} d="M0 0h306v194H0z" />
      <Show when={!isPhysical() && !isFrozen()}>
        <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="153" y1="8.4" x2="153" y2="380.2">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset=".2" stop-color="#effff4" stop-opacity=".2" />
          <stop offset="1" stop-color="#afffc6" />
        </linearGradient>
        <path fill="url(#c)" d="M0 0h306v194H0z" />
      </Show>
      <Show when={!isFrozen()}>
        <path
          fill={isPhysical() ? '#000' : '#afffc6'}
          opacity={isPhysical() ? '0.03' : '0.3'}
          d={
            'M0 143.9v9.6l16.7-7.8A87 87 0 0 0 0 143.9zm27.5-26.7-19.5 9c-1.8.9-1.8.9-2.5 1.6h.7c21.9-5.5 ' +
            '46.3-8.6 87.3 10.5a15 15 0 0 0 10.6.6l19.5-9.1.4-.2c-46.5-23.1-72.7-18.3-96.5-12.4zm173.3 24.' +
            '6-.3.2.3.2v-.4zm-174.1-51A194 194 0 0 1 0 82v19.2a15 15 0 0 0 7.2-1.4l19.5-9zm23.8 14.7c1.8-.' +
            '8 1.8-.8 2.5-1.6h-.7a118.5 118.5 0 0 1-52.2 3.5V120c10.3-.6 20.2-2.8 30.9-5.5l19.5-9zM22 118.' +
            '7l-.8.3.8-.2v-.1zm149.4 31.1c1.4 1 3 1.7 4.7 2 1.7.3 3.4.1 5.1-.4l19.3-9.3a284 284 0 0 0-35.7' +
            '-22.8c-49.6-26.7-76.9-23.2-101.5-17.4-2.7.8-5.4 1.8-7.9 3l-19.5 9c25.2-6.2 52.9-11.1 104.6 16' +
            '.7 10.7 5.5 21 12 30.9 19.2zM21.2 119c-6.7 1.7-13.7 3.4-21.2 4.4v5.3l2.5-1.1 18.7-8.6zm4.6 22' +
            '.6 19.4-9.1H45c2.1-.8 2.5-1 2.1-2-.5-1-.5-1-1.7-1A124.3 124.3 0 0 0-.1 131v8.2c8.8-.2 17.4.6 ' +
            '25.9 2.4zm26.9-6.9-19.5 9c36 10 66.2 30 89.6 50.3h36.7c-23.5-22.7-55-46-97.2-60.1a15 15 0 0 0' +
            '-9.6.8zm-48 21.6c-3.3 1.6-2.1 2.9 0 3.6a268 268 0 0 1 66 34h39.1a258.9 258.9 0 0 0-85.6-46.7l' +
            '-19.5 9.1zM139.2 138c-1.6-.9-3.5-1.5-5.3-1.7-1.9-.2-3.8 0-5.5.6l-19.5 9a270.1 270.1 0 0 1 63.' +
            '9 48.1H208a304.2 304.2 0 0 0-68.8-56zm89.8-15.2a292.3 292.3 0 0 0-31-19.4c-33.4-18-56.7-22.3-' +
            '75.8-21.5-2.9.4-5.7 1.2-8.3 2.5l-19.5 9c19.8-1.6 43.9 2.1 79.4 21.1a271.8 271.8 0 0 1 36 23.1' +
            'l19.5-9.1h-.3c1.2-.4 4.2-2.2 0-5.7zM55.2 78c1.2-.6 2.2-1.2 2-2.3a195.5 195.5 0 0 1-46-18.6L0 ' +
            '50.7V74a197 197 0 0 0 35.6 13l19.6-9zM0 187.2c4.4 2.2 8.7 4.5 12.7 6.8h44.4c-13.7-9.5-35-20.8' +
            '-57.1-28.1v21.3zM42.6 88c18.6 2.8 37.6 1.3 55.6-4.4 15.8-4.9 32.5-6.6 49-5.1 4.8 0 4.8 0 27.7' +
            '-10.3a123 123 0 0 0-53.2 4.6A125.3 125.3 0 0 1 68 77.5c-3.8.5-3.8.5-25.4 10.5zm70.7-5.3C96.7 ' +
            '84.8 80.6 90.8 64 92.9c-10.1 1.2-20.2.9-30.2-.8l-19.4 9c-2.1 1-2.1 1.2-2.1 2a69.9 69.9 0 0 0 ' +
            '27.7 1c15.6-1.6 30.5-7 46-9.6 3.8-.7 3.8-.7 27.6-11.7h-.3z'
          }
        />
      </Show>
      <Show when={isPhysical() && isActivated() && !isFrozen() && props.number !== undefined}>
        <radialGradient id="a" cx="47.5" cy="101" r="21.4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#fff" />
          <stop offset="1" stop-color="#dddcda" />
        </radialGradient>
        <path d="M28 93a5 5 0 0 1 5-5h29a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H33a5 5 0 0 1-5-5V93z" fill="url(#a)" />
        <path
          fill="#fff"
          d={
            'M67 95.9v-1H52.3v-.1L47.9 88h-.8l-4.3 6.8v.1H28v1h14.9l.1.3.4 2.5a19 19 0 0 1-.4 6.6H28v1h14' +
            '.7v.1L47 114h.9l4.3-7.6v-.1H67v-1H52.1v-.1l-.4-2.1c-.2-1.7-.2-4.2.5-7.2H67zm-16.3 7.3.4 2.3.' +
            '2.6-3.8 6.7-3.8-6.7c.8-2.6.8-5.3.6-7.4l-.4-2.7-.2-.8v-.1l3.8-5.9 3.8 6c-.8 3.3-.8 6.1-.6 8z'
          }
        />
      </Show>
      <path
        fill={isFrozen() ? '#fff' : '#000'}
        opacity={opacity()}
        d={
          'M283.8 24.6c0-.2-.1-.5-.3-.6l-7.8-3.9c-.4-.2-.7-.1-.7.3v2.4l8.8 3.3v-1.5zm-4 6.5c0 .3.2.5.4.5h' +
          '5.4l.2-.4V30l-6-.8v1.9zm5.8-3.6L275 24.2v2.4c0 .4.3.7.7.8l10.1 1.9V28l-.2-.5zM181.3 35.1a4 4 0' +
          ' 0 1 1.9-.4c1.2 0 2.1.3 2.8 1 .7.7.9 1.5 1 1.9v.1h1.8v-.1a5.6 5.6 0 0 0-1.7-3.2c-1-.9-2.3-1.4-' +
          '3.9-1.4a7 7 0 0 0-2.5.5c-.7.3-1.4.8-1.9 1.4-.5.6-1 1.3-1.2 2.1-.3.8-.4 1.7-.4 2.7 0 1 .1 1.9.4' +
          ' 2.7.3.8.7 1.5 1.2 2.1.5.6 1.2 1.1 1.9 1.4a7 7 0 0 0 2.5.5c1.5 0 2.9-.5 3.9-1.4.5-.4.9-1 1.1-1' +
          '.6.3-.6.5-1.3.5-2v-.1h-1.8v.1c-.1.9-.4 1.7-.9 2.3l-1.1.8c-.5.2-1.1.3-1.7.3-.7 0-1.4-.1-1.9-.4-' +
          '.5-.3-1-.7-1.3-1.2a6.5 6.5 0 0 1 0-7c.3-.5.8-.9 1.3-1.1zm50.6 4.7c-.9-.6-2.1-.9-3.5-1.2l-.3-.1' +
          'c-.8-.2-1.6-.4-2.1-.7-.5-.3-.8-.8-.8-1.5 0-.5.2-.9.7-1.2a4 4 0 0 1 2-.5c1 0 1.7.2 2.2.6.5.4.8 ' +
          '1 .9 1.9v.1h1.8v-.1a4.8 4.8 0 0 0-1.5-3.1c-.9-.7-2-1.1-3.4-1.1l-1.9.2-1.4.7a3 3 0 0 0-1.2 2.5c' +
          '0 .6.1 1.1.4 1.6.2.4.6.8 1 1.1a9 9 0 0 0 2.9 1c1.4.3 2.4.6 3 .9.3.2.5.4.6.7l.2 1c0 .6-.2 1.1-.' +
          '6 1.4-.5.4-1.3.6-2.3.6-1.2 0-2.2-.3-2.8-.9a3 3 0 0 1-1-2.1v-.1H223v.1c.1 1.4.7 2.6 1.8 3.5 1 .' +
          '8 2.4 1.2 3.9 1.2.8 0 1.5-.1 2.1-.3.6-.2 1.1-.5 1.5-.8.4-.3.7-.7.9-1.2.2-.4.3-.9.3-1.4 0-.7-.1' +
          '-1.3-.4-1.8l-1.2-1zm11.2-2.9a4.5 4.5 0 0 0-5.4-1c-.4.2-.8.5-1.1.9v-1.1h-1.8v13.9h1.8V45c.3.4.7' +
          '.7 1.1.9.6.3 1.3.5 2.1.5 1.3 0 2.5-.5 3.3-1.5a5.9 5.9 0 0 0 1.4-4 5.9 5.9 0 0 0-1.4-4zm-1.2 6.' +
          '8c-.6.8-1.3 1.2-2.3 1.2-.9 0-1.6-.4-2.2-1.1-.5-.7-.8-1.7-.8-2.8s.3-2.1.8-2.8c.5-.7 1.3-1.1 2.2' +
          '-1.1.9 0 1.7.4 2.3 1.2.5.7.8 1.7.8 2.7s-.3 2-.8 2.7zm8.7-8.2c-1.5 0-2.8.5-3.7 1.5a6 6 0 0 0-1.' +
          '4 4.1c0 1.6.5 3 1.4 4 .9 1 2.2 1.5 3.8 1.5 1.2 0 2.3-.3 3.1-1 .7-.6 1.3-1.5 1.5-2.5V43h-1.8v.1' +
          'a2 2 0 0 1-.8 1.2c-.5.5-1.3.7-2.1.7a3 3 0 0 1-2.4-1.1c-.5-.6-.8-1.4-.8-2.3h8.1v-.1c0-1.9-.4-3.' +
          '3-1.2-4.3-.9-1.2-2.1-1.7-3.7-1.7zm-3.2 4.4c0-.7.3-1.4.9-1.9.6-.6 1.4-.9 2.3-.9l1.3.2c.4.1.7.4 ' +
          '1 .6.5.5.8 1.2.8 1.9h-6.3zm17.2-3.6a4 4 0 0 0-2.5-.8 5 5 0 0 0-2.2.5c-.4.2-.8.5-1.1.9v-1.1H257' +
          'v10.5h1.8v-6.5l.2-1.1c.1-.3.3-.6.6-.8.5-.5 1.3-.7 2.1-.7.7 0 1.3.2 1.6.6.3.4.5.9.5 1.6v6.9h1.8' +
          'V39c0-.6-.1-1.1-.3-1.6-.1-.4-.4-.8-.7-1.1zm-74.3 9.9h1.8V31.6h-1.8v14.6zm8.3-10.7c-1.5 0-2.8.5' +
          '-3.7 1.5a6 6 0 0 0-1.4 4.1c0 1.6.5 3 1.4 4 .9 1 2.2 1.5 3.8 1.5 1.2 0 2.3-.3 3.1-1 .7-.6 1.3-1' +
          '.5 1.5-2.5V43h-1.8v.1a2 2 0 0 1-.8 1.2c-.5.5-1.3.7-2.1.7a3 3 0 0 1-2.4-1.1c-.5-.6-.8-1.4-.8-2.' +
          '3h8.1v-.1c0-1.9-.4-3.3-1.2-4.3-.9-1.2-2.1-1.7-3.7-1.7zm-3.2 4.4c0-.7.3-1.4.9-1.9.6-.6 1.4-.9 2' +
          '.3-.9l1.3.2c.4.1.7.4 1 .6.5.5.8 1.2.8 1.9h-6.3zm18.8 4.9c-.6 0-.8-.3-.8-1v-5c0-1.2-.4-2.1-1.2-' +
          '2.6-.6-.5-1.5-.7-2.6-.7-1.4 0-2.5.3-3.3 1l-.8 1.1c-.2.4-.3.9-.3 1.4v.1h1.8V39c.1-.7.2-1.2.6-1.' +
          '5.4-.3 1-.4 2-.4.7 0 1.3.1 1.6.4.3.2.4.5.4 1 0 .9-.7 1.1-2.4 1.5-1.4.3-2.5.5-3.2 1-.4.3-.7.6-.' +
          '9 1-.2.4-.3.9-.3 1.5 0 .9.3 1.6 1 2.2a4 4 0 0 0 2.5.8c1.6 0 2.7-.5 3.5-1.5.1.5.4.8.7 1 .3.2.7.' +
          '3 1.2.3.3 0 .6 0 1-.2h.1v-1.3h-.6zm-3.5-.6c-.6.4-1.4.7-2.3.7-.6 0-1.1-.1-1.4-.4-.3-.2-.4-.6-.4' +
          '-1.1 0-.6.2-1 .7-1.3.4-.3 1.1-.5 2.2-.8a7 7 0 0 0 2.2-.7v1.5a3 3 0 0 1-1 2.1zm9.7-8.7c-.7 0-1.' +
          '3.2-1.8.7-.4.3-.7.7-.9 1.3v-1.7h-1.8v10.5h1.8v-5.6c0-.9.3-1.8.8-2.4l1-.7 1.2-.3.6.1h.1v-1.8h-.' +
          '1l-.9-.1zm54.6-3.9v5.3c-.3-.4-.7-.7-1.1-.9a4.6 4.6 0 0 0-5.5 1c-.9 1-1.4 2.4-1.4 4s.5 3 1.4 4a' +
          '4.7 4.7 0 0 0 5.5 1c.4-.2.8-.5 1.1-.9v1.1h1.8V31.6H275zm-.8 12.2c-.5.7-1.3 1.1-2.2 1.1-.9 0-1.' +
          '7-.4-2.3-1.2-.5-.7-.8-1.7-.8-2.7 0-1 .3-2 .8-2.7.6-.8 1.3-1.2 2.3-1.2.9 0 1.7.4 2.2 1.1.5.7.8 ' +
          '1.7.8 2.8 0 1.1-.3 2.1-.8 2.8z'
        }
      />
      <text x="277" y="68" text-anchor="end" fill="#000" opacity={opacity()} class={css.number}>
        <Show when={isActivated()} fallback="••••">
          {props.number && formatAccountNumber(props.number)}
        </Show>
      </text>
      <Switch>
        <Match when={!isActivated()}>
          <>
            <text x="258" y="168" text-anchor="end" fill="000" class={css.inactive}>
              {i18n.t('Not activated')}
            </text>
            <g transform="translate(258, 149)">
              <Icon name="information" />
            </g>
          </>
        </Match>
        <Match when={props.status === 'INACTIVE'}>
          <>
            <g transform="translate(22, 28)" style={{ color: '#5BEA83' }}>
              <Icon name="freeze" />
            </g>
            <text x="48" y="45" fill="#fff" class={css.frozen}>
              {i18n.t('Frozen')}
            </text>
          </>
        </Match>
        <Match when={Boolean(props.name)}>
          <text x="28" y="160" fill="000" class={css.name}>
            {props.name}
          </text>
        </Match>
      </Switch>
    </svg>
  );
}
