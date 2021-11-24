import { Dynamic, Show, Switch, Match } from 'solid-js/web';
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

import type { User } from '../../types';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface CardsProps {
  userId: User['userId'];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();
  const [cards, status, , , reload] = useResource(searchCards, { ...DEFAULT_PARAMS, userId: props.userId });

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
          {(data) => (
            <Show when={data.content.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
              <Dynamic component={media.large ? CardsTable : CardsList} data={data} hideColumns={['name']} />
            </Show>
          )}
        </Match>
      </Switch>
    </>
  );
}
