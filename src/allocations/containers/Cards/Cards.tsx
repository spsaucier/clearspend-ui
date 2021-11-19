import { createMemo } from 'solid-js';
import { Show, Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { CardsList } from 'cards/components/CardsList';
import { CardsTable } from 'cards/components/CardsTable';
import CARDS from 'cards/cards.json';
import type { SearchCardResponse } from 'cards/types';

import { AllocationBalances } from '../../components/AllocationBalances';
import type { Allocation } from '../../types';

import css from './Cards.css';

const DATA = {
  number: 0,
  size: 10,
  totalElements: 6,
  content: [...CARDS, ...CARDS, ...CARDS] as unknown as SearchCardResponse['content'],
} as SearchCardResponse;

interface CardsProps {
  current: Readonly<Allocation>;
  items: readonly Readonly<Allocation>[];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();

  const children = createMemo(() =>
    props.current.childrenAllocationIds.map((id) => props.items.find((item) => item.allocationId === id)!),
  );

  return (
    <>
      <Show when={children().length}>
        <AllocationBalances current={props.current} items={children()} />
        <h3 class={css.title}>
          <Text message="Cards" />
        </h3>
      </Show>
      <Dynamic component={media.wide ? CardsTable : CardsList} data={DATA} hideColumns={['allocation']} />
    </>
  );
}
