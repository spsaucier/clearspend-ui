import { For, Show } from 'solid-js';
import type { Setter } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { InputSearch } from '_common/components/InputSearch';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { Empty } from 'app/components/Empty';
import type { StoreSetter } from '_common/utils/store';
import type { UUIDString } from 'app/types/common';
import type { PagedDataSearchCardData, SearchCardRequest } from 'generated/capital';
import type { CardType as CardTypeType } from 'cards/types';

import { CardIcon } from '../CardIcon';
import { CardType } from '../CardType';
import { formatCardNumber } from '../../utils/formatCardNumber';

import css from './CardsList.css';

interface CardsListProps {
  search?: string;
  data: PagedDataSearchCardData;
  onCardClick: (id: UUIDString) => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>> | StoreSetter<Readonly<SearchCardRequest>>;
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
        onSearch={changeRequestSearch(props.onChangeParams)}
      />
      <Show when={props.data.content?.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
        <For each={props.data.content}>
          {(item) => (
            <div class={css.item} onClick={() => props.onCardClick(item.cardId as UUIDString)}>
              <CardIcon type={item.cardType as CardTypeType} />
              <div>
                <div class={css.name}>{formatCardNumber(item.cardNumber)}</div>
                <CardType type={item.cardType as CardTypeType} class={css.type} />
              </div>
              <div>
                <strong>{formatCurrency(item.balance?.amount || 0)}</strong>
                <div class={css.limit}>[Limit]</div>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
