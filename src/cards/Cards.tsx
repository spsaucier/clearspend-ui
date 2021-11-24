import { Switch, Match, Show, Dynamic } from 'solid-js/web';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { Button } from '_common/components/Button';
import { Page } from 'app/components/Page';
import { Empty } from 'app/components/Empty';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';

import { CardsList } from './components/CardsList';
import { CardsTable } from './components/CardsTable';
import { useCards } from './stores/cards';
import type { SearchCardRequest } from './types';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export default function Cards() {
  const navigate = useNavigate();
  const media = useMediaContext();

  const cardsStore = useCards({ params: DEFAULT_PARAMS });

  return (
    <Page
      title="Cards"
      actions={
        <Button type="primary" size="lg" icon="add" onClick={() => navigate('/cards/edit')}>
          New card
        </Button>
      }
    >
      <Switch>
        <Match when={cardsStore.error}>
          <LoadingError onReload={cardsStore.reload} />
        </Match>
        <Match when={cardsStore.loading && !cardsStore.data}>
          <Loading />
        </Match>
        <Match when={cardsStore.data}>
          {(data) => (
            <Show when={data.content.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
              <Dynamic component={media.large ? CardsTable : CardsList} data={data} />
            </Show>
          )}
        </Match>
      </Switch>
    </Page>
  );
}
