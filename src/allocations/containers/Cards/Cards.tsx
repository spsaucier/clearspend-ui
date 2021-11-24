import { createMemo } from 'solid-js';
import { Show, Switch, Match, Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { Empty } from 'app/components/Empty';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { CardsList } from 'cards/components/CardsList';
import { CardsTable } from 'cards/components/CardsTable';
import { searchCards } from 'cards/services';
import type { SearchCardRequest } from 'cards/types';

import { AllocationBalances } from '../../components/AllocationBalances';
import type { Allocation } from '../../types';

import css from './Cards.css';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface CardsProps {
  current: Readonly<Allocation>;
  items: readonly Readonly<Allocation>[];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();

  const children = createMemo(() =>
    props.current.childrenAllocationIds.map((id) => props.items.find((item) => item.allocationId === id)!),
  );

  const [cards, status, , , reload] = useResource(searchCards, {
    ...DEFAULT_PARAMS,
    allocationId: props.current.allocationId,
  });

  return (
    <>
      <Show when={children().length}>
        <AllocationBalances current={props.current} items={children()} />
        <h3 class={css.title}>
          <Text message="Cards" />
        </h3>
      </Show>
      <Switch>
        <Match when={status().error}>
          <LoadingError onReload={reload} />
        </Match>
        <Match when={status().loading && !cards()}>
          <Loading />
        </Match>
        <Match when={cards()}>
          {(data) => (
            <Show when={data.content.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
              <Dynamic component={media.wide ? CardsTable : CardsList} data={data} hideColumns={['allocation']} />
            </Show>
          )}
        </Match>
      </Switch>
    </>
  );
}
