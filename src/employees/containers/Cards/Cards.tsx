import { createMemo } from 'solid-js';
import { Dynamic, Switch, Match } from 'solid-js/web';

import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { CardsList } from 'cards/components/CardsList';
import { CardsTable } from 'cards/components/CardsTable';
import CARDS from 'cards/cards.json';
import type { SearchCardResponse } from 'cards/types';

import { getUserCards } from '../../services';
import type { User } from '../../types';

const DATA = {
  number: 0,
  size: 10,
  totalElements: 0,
  content: [] as SearchCardResponse['content'],
} as SearchCardResponse;

interface CardsProps {
  userId: User['userId'];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();
  const [cards, status, , , reload] = useResource(getUserCards, props.userId);

  return (
    <>
      <Switch>
        <Match when={status().error}>
          <LoadingError onReload={reload} />
        </Match>
        <Match when={status().loading && !cards()}>
          <Loading />
        </Match>
        <Match when={cards()}>
          {(items) => {
            const data = createMemo(
              () => ({ ...DATA, content: items.length ? items : CARDS } as unknown as SearchCardResponse),
            );
            return <Dynamic component={media.large ? CardsTable : CardsList} data={data()} hideColumns={['name']} />;
          }}
        </Match>
      </Switch>
    </>
  );
}
