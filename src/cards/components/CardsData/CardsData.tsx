import { Switch, Match, Show, Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { Empty } from 'app/components/Empty';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import type { UUIDString } from 'app/types/common';

import { CardsList } from '../CardsList';
import { CardsTable } from '../CardsTable';
import type { SearchCardResponse } from '../../types';

interface CardsDataProps {
  loading: boolean;
  error: unknown;
  data: Readonly<SearchCardResponse> | null;
  table?: boolean;
  hide?: readonly string[];
  onUserClick?: (id: UUIDString) => void;
  onCardClick: (id: UUIDString) => void;
  onReload: () => Promise<unknown>;
}

export function CardsData(props: Readonly<CardsDataProps>) {
  return (
    <Switch>
      <Match when={props.error}>
        <LoadingError onReload={props.onReload} />
      </Match>
      <Match when={props.loading && !props.data}>
        <Loading />
      </Match>
      <Match when={props.data}>
        <Show when={props.data!.content.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
          <Dynamic
            component={props.table ? CardsTable : CardsList}
            data={props.data!}
            hideColumns={props.hide}
            onUserClick={props.onUserClick}
            onCardClick={props.onCardClick}
          />
        </Show>
      </Match>
    </Switch>
  );
}
