import { For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { InputSearch } from '_common/components/InputSearch';
import { Empty } from 'app/components/Empty';
import type { UUIDString } from 'app/types/common';

import { CardIcon } from '../CardIcon';
import { CardType } from '../CardType';
import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCardResponse } from '../../types';

import css from './CardsList.css';

interface CardsListProps {
  search?: string;
  data: SearchCardResponse;
  onSearch: (value: string) => void;
  onCardClick: (id: UUIDString) => void;
}

export function CardsList(props: Readonly<CardsListProps>) {
  const i18n = useI18n();

  return (
    <div>
      <InputSearch
        delay={400}
        value={props.search}
        placeholder={i18n.t('Search cards...') as string}
        class={css.search}
        onSearch={props.onSearch}
      />
      <Show when={props.data.content.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
        <For each={props.data.content}>
          {(item) => (
            <div class={css.item} onClick={() => props.onCardClick(item.cardId)}>
              <CardIcon type={item.cardType} />
              <div>
                <div class={css.name}>{formatCardNumber(item.cardNumber)}</div>
                <CardType type={item.cardType} class={css.type} />
              </div>
              <div>
                <strong>{formatCurrency(item.balance.amount)}</strong>
                <div class={css.limit}>[Limit]</div>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
