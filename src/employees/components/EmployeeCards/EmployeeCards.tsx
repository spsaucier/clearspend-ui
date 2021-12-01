import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import type { UUIDString } from 'app/types/common';
import { formatCardNumber } from 'cards/utils/formatCardNumber';

import type { CardInfo } from '../../types';

import css from './EmployeeCards.css';

interface EmployeeCardsProps {
  data: readonly Readonly<CardInfo>[];
  onCardClick?: (id: UUIDString) => void;
}

export function EmployeeCards(props: Readonly<EmployeeCardsProps>) {
  const [card, ...rest] = props.data;

  return (
    <Show when={card} fallback={<Text message="No card" />}>
      <div class={css.card} onClick={() => props.onCardClick?.(card!.cardId)}>
        {formatCardNumber(card!.lastFour)}
      </div>
      <Show when={rest.length}>
        <Text message="{count} more {count, plural, one {card} other {cards}}" count={rest.length} class={css.more!} />
      </Show>
    </Show>
  );
}
