import { createMemo, Show, Switch, Match } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { join } from '_common/utils/join';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Icon } from '_common/components/Icon';
import type { Card as ICard } from 'generated/capital';

import { formatCardNumber } from '../../utils/formatCardNumber';
import { CardType } from '../../types';

import css from './Card.css';

const PRIMARY_COLOR = '#5bea83';
const FROZEN_COLOR = '#10292C';
const NOT_ACTIVATED_OPACITY = 0.2;

const BACKGROUND: Readonly<Record<CardType, string>> = {
  [CardType.VIRTUAL]: '#F3F2EF',
  [CardType.PHYSICAL]: '#43FA76',
};

export interface CardProps {
  type: CardType;
  name?: string;
  allocation?: string;
  number?: string;
  balance?: number;
  details?: string;
  status?: ICard['status'];
  notActivated?: boolean;
  class?: string;
}

export function Card(props: Readonly<CardProps>) {
  const i18n = useI18n();

  const isFrozen = createMemo(() => !props.notActivated && props.status === 'INACTIVE');
  const mainColor = createMemo(() => (isFrozen() ? '#fff' : '#000'));
  const mainOpacity = createMemo(() => (props.notActivated || props.status === 'INACTIVE' ? NOT_ACTIVATED_OPACITY : 1));

  return (
    <svg
      width="306"
      height="192"
      viewBox="0 0 306 192"
      xmlns="http://www.w3.org/2000/svg"
      class={join(css.root, props.class)}
    >
      <path
        fill={isFrozen() ? FROZEN_COLOR : BACKGROUND[props.type]}
        d="M295 192H11a11 11 0 0 1-11-11V11A11 11 0 0 1 11 0h284a11 11 0 0 1 11 11v170a11 11 0 0 1-11 11z"
      />
      <path
        fill={mainColor()}
        opacity={0.02}
        d={
          'M122.7 192H295a11 11 0 0 0 10.9-10l-183.2-23.6V192zM5 1.8c-3 2-5 5.3-5 9.2v86.6l306 ' +
          '57.7V97.5L5 1.8zm252 .8-.2-2.6H118.4L257 52.4V2.6z'
        }
      />
      <g opacity={mainOpacity()}>
        <path
          fill={mainColor()}
          d={
            'M273.7 154.8h-3c-.9 0-1.6.3-2 1.2l-5.7 13.8h4l.8-2.2h5l.5 2.2h3.6l-3.2-15zm-4.8 9.7 ' +
            '1.5-4.2.5-1.4.3 1.3.9 4.3h-3.2zm-9.7-6.6a7 7 0 0 1 2.9.6l.3.2.5-3.2c-.8-.3-2-.6-3.5-' +
            '.6-3.8 0-6.5 2-6.5 5 0 2.2 1.9 3.3 3.4 4.1 1.5.7 2 1.2 2 1.9 0 1-1.2 1.5-2.3 1.5a7 7' +
            ' 0 0 1-3.6-.8l-.5-.2-.5 3.4c.9.4 2.6.8 4.3.8 4 0 6.7-2 6.7-5.1 0-1.7-1-3-3.2-4.1-1.3' +
            '-.7-2.2-1.1-2.2-1.9 0-.9.7-1.6 2.2-1.6zm-11.7-3.1-2.4 15h3.9l2.4-15h-3.9zm-6.5 0-3.8' +
            ' 10.2-.4-2.1-1.3-6.9c-.2-1-.9-1.2-1.7-1.3h-6.2l-.1.3c1.5.4 2.9 1 4.1 1.7l3.4 13h4.1l' +
            '6.1-15H241z'
          }
        />
        <text x="279" y="70" text-anchor="end" fill={mainColor()} class={css.text}>
          <Show when={!props.notActivated} fallback="••••">
            {props.number && formatCardNumber(props.number)}
          </Show>
        </text>
        <Show when={props.name}>
          <text x="279" y="92" text-anchor="end" fill={mainColor()} class={css.text}>
            {props.name}
          </text>
        </Show>
        <Show when={props.allocation}>
          <text x="279" y="114" text-anchor="end" fill={mainColor()} class={css.text}>
            {props.allocation}
          </text>
        </Show>
        <Show when={props.details}>
          <text x="279" y="136" text-anchor="end" fill={mainColor()} class={css.text}>
            {props.details}
          </text>
        </Show>
        <path
          fill={props.type === CardType.VIRTUAL ? PRIMARY_COLOR : '#000'}
          d={
            'M284.8 24.3c0-.2-.1-.5-.3-.6l-7.8-3.9c-.4-.2-.7-.1-.7.3v2.4l8.8 3.3v-1.5zm-4 6.5c0 .' +
            '3.2.5.4.5h5.4l.2-.4v-1.3l-6-.8v2zm5.8-3.6L276 23.9v2.4c0 .4.3.7.7.8l10.1 1.9v-1.3l-.' +
            '2-.5z'
          }
        />
        <path
          fill={mainColor()}
          d={
            'M182.3 34.8a4 4 0 0 1 1.9-.4c1.2 0 2.1.3 2.8 1 .7.7.9 1.5 1 1.9v.1h1.8v-.1a5.6 5.6 0' +
            ' 0 0-1.7-3.2c-1-.9-2.3-1.4-3.9-1.4a7 7 0 0 0-2.5.5c-.7.3-1.4.8-1.9 1.4-.5.6-1 1.3-1.' +
            '2 2.1-.3.8-.4 1.7-.4 2.7 0 1 .1 1.9.4 2.7.3.8.7 1.5 1.2 2.1.5.6 1.2 1.1 1.9 1.4a7 7 ' +
            '0 0 0 2.5.5c1.5 0 2.9-.5 3.9-1.4.5-.4.9-1 1.1-1.6.3-.6.5-1.3.5-2V41h-1.8v.1c-.1.9-.4' +
            ' 1.7-.9 2.3l-1.1.8c-.5.2-1.1.3-1.7.3-.7 0-1.4-.1-1.9-.4-.5-.3-1-.7-1.3-1.2a6.5 6.5 0' +
            ' 0 1 0-7c.3-.5.8-.9 1.3-1.1zm50.6 4.7c-.9-.6-2.1-.9-3.5-1.2l-.3-.1c-.8-.2-1.6-.4-2.1' +
            '-.7-.5-.3-.8-.8-.8-1.5 0-.5.2-.9.7-1.2a4 4 0 0 1 2-.5c1 0 1.7.2 2.2.6.5.4.8 1 .9 1.9' +
            'v.1h1.8v-.1a4.8 4.8 0 0 0-1.5-3.1c-.9-.7-2-1.1-3.4-1.1l-1.9.2-1.4.7a3 3 0 0 0-1.2 2.' +
            '5c0 .6.1 1.1.4 1.6.2.4.6.8 1 1.1a9 9 0 0 0 2.9 1c1.4.3 2.4.6 3 .9.3.2.5.4.6.7l.2 1c0' +
            ' .6-.2 1.1-.6 1.4-.5.4-1.3.6-2.3.6-1.2 0-2.2-.3-2.8-.9a3 3 0 0 1-1-2.1v-.1H224v.1c.1' +
            ' 1.4.7 2.6 1.8 3.5 1 .8 2.4 1.2 3.9 1.2.8 0 1.5-.1 2.1-.3.6-.2 1.1-.5 1.5-.8.4-.3.7-' +
            '.7.9-1.2.2-.4.3-.9.3-1.4 0-.7-.1-1.3-.4-1.8l-1.2-1zm11.2-2.8a4.5 4.5 0 0 0-5.4-1c-.4' +
            '.2-.8.5-1.1.9v-1.1h-1.8v13.9h1.8v-4.6c.3.4.7.7 1.1.9.6.3 1.3.5 2.1.5 1.3 0 2.5-.5 3.' +
            '3-1.5a5.9 5.9 0 0 0 1.4-4c0-.8-.1-1.6-.4-2.3a4 4 0 0 0-1-1.7zm-1.2 6.7c-.6.8-1.3 1.2' +
            '-2.3 1.2-.9 0-1.6-.4-2.2-1.1-.5-.7-.8-1.7-.8-2.8s.3-2.1.8-2.8c.5-.7 1.3-1.1 2.2-1.1.' +
            '9 0 1.7.4 2.3 1.2.5.7.8 1.7.8 2.7s-.3 2-.8 2.7zm8.7-8.2c-1.5 0-2.8.5-3.7 1.5a6 6 0 0' +
            ' 0-1.4 4.1c0 1.6.5 3 1.4 4 .9 1 2.2 1.5 3.8 1.5 1.2 0 2.3-.3 3.1-1 .7-.6 1.3-1.5 1.5' +
            '-2.5v-.1h-1.8v.1a2 2 0 0 1-.8 1.2c-.5.5-1.3.7-2.1.7a3 3 0 0 1-2.4-1.1c-.5-.6-.8-1.4-' +
            '.8-2.3h8.1v-.1c0-1.9-.4-3.3-1.2-4.3-.9-1.2-2.1-1.7-3.7-1.7zm-3.2 4.4c0-.7.3-1.4.9-1.' +
            '9.6-.6 1.4-.9 2.3-.9l1.3.2c.4.1.7.4 1 .6.5.5.8 1.2.8 1.9h-6.3zm17.2-3.6a4 4 0 0 0-2.' +
            '5-.8 5 5 0 0 0-2.2.5c-.4.2-.8.5-1.1.9v-1.1H258V46h1.8v-6.5l.2-1.1c.1-.3.3-.6.6-.8.5-' +
            '.5 1.3-.7 2.1-.7.7 0 1.3.2 1.6.6.3.4.5.9.5 1.6V46h1.8v-7.3c0-.6-.1-1.1-.3-1.6-.1-.4-' +
            '.4-.8-.7-1.1zm-74.3 9.9h1.8V31.4h-1.8v14.5zm8.3-10.7c-1.5 0-2.8.5-3.7 1.5a6 6 0 0 0-' +
            '1.4 4.1c0 1.6.5 3 1.4 4 .9 1 2.2 1.5 3.8 1.5 1.2 0 2.3-.3 3.1-1 .7-.6 1.3-1.5 1.5-2.' +
            '5v-.1h-1.8v.1a2 2 0 0 1-.8 1.2c-.5.5-1.3.7-2.1.7a3 3 0 0 1-2.4-1.1c-.5-.6-.8-1.4-.8-' +
            '2.3h8.1v-.1c0-1.9-.4-3.3-1.2-4.3-.9-1.2-2.1-1.7-3.7-1.7zm-3.2 4.4c0-.7.3-1.4.9-1.9.6' +
            '-.6 1.4-.9 2.3-.9l1.3.2c.4.1.7.4 1 .6.5.5.8 1.2.8 1.9h-6.3zm18.8 4.9c-.6 0-.8-.3-.8-' +
            '1v-5c0-1.2-.4-2.1-1.2-2.6-.6-.5-1.5-.7-2.6-.7-1.4 0-2.5.3-3.3 1l-.8 1.1c-.2.4-.3.9-.' +
            '3 1.4v.1h1.8v-.1c.1-.7.2-1.2.6-1.5.4-.3 1-.4 2-.4.7 0 1.3.1 1.6.4.3.2.4.5.4 1 0 .9-.' +
            '7 1.1-2.4 1.5-1.4.3-2.5.5-3.2 1-.4.3-.7.6-.9 1-.2.4-.3.9-.3 1.5 0 .9.3 1.6 1 2.2a4 4' +
            ' 0 0 0 2.5.8c1.6 0 2.7-.5 3.5-1.5.1.5.4.8.7 1 .3.2.7.3 1.2.3.3 0 .6 0 1-.2h.1v-1.3h-' +
            '.6zm-3.5-.6c-.6.4-1.4.7-2.3.7-.6 0-1.1-.1-1.4-.4-.3-.2-.4-.6-.4-1.1 0-.6.2-1 .7-1.3.' +
            '4-.3 1.1-.5 2.2-.8a7 7 0 0 0 2.2-.7v1.5c-.1 1-.4 1.7-1 2.1zm9.7-8.7c-.7 0-1.3.2-1.8.' +
            '7-.4.3-.7.7-.9 1.3v-1.7h-1.8V46h1.8v-5.6c0-.9.3-1.8.8-2.4l1-.7 1.2-.3.6.1h.1v-1.8h-.' +
            '1l-.9-.1zm54.6-3.8v5.3c-.3-.4-.7-.7-1.1-.9a4.6 4.6 0 0 0-5.5 1c-.9 1-1.4 2.4-1.4 4s.' +
            '5 3 1.4 4a4.7 4.7 0 0 0 5.5 1c.4-.2.8-.5 1.1-.9V46h1.8V31.4H276zm-.8 12.1c-.5.7-1.3 ' +
            '1.1-2.2 1.1-.9 0-1.7-.4-2.3-1.2-.5-.7-.8-1.7-.8-2.7 0-1 .3-2 .8-2.7.6-.8 1.3-1.2 2.3' +
            '-1.2.9 0 1.7.4 2.2 1.1.5.7.8 1.7.8 2.8s-.3 2.1-.8 2.8z'
          }
        />
      </g>
      <Switch
        fallback={
          <text x="27" y="168" class={css.amount}>
            {props.balance && formatCurrency(props.balance)}
          </text>
        }
      >
        <Match when={props.notActivated}>
          <>
            <g transform="translate(24, 150)">
              <Icon name="warning-triangle" />
            </g>
            <text x="50" y="168" class={css.inactive}>
              {i18n.t('Not activated')}
            </text>
          </>
        </Match>
        <Match when={props.status === 'INACTIVE'}>
          <>
            <g transform="translate(24, 150)" style={{ color: PRIMARY_COLOR }}>
              <Icon name="freeze" />
            </g>
            <text x="50" y="167" fill="#fff" class={css.frozen}>
              {i18n.t('Card frozen')}
            </text>
          </>
        </Match>
      </Switch>
      <Show when={props.type === CardType.VIRTUAL}>
        <text x="27" y="45" fill={mainColor()} opacity={mainOpacity()} class={css.type}>
          {i18n.t('Virtual Card')}
        </text>
      </Show>
    </svg>
  );
}
