import type { Setter } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { StoreSetter } from '_common/utils/store';
import { Data } from 'app/components/Data';
import type { UUIDString } from 'app/types/common';

import { CardsList } from '../CardsList';
import { CardsTable } from '../CardsTable';
import type { SearchCardResponse, SearchCardRequest } from '../../types';

interface CardsDataProps {
  loading: boolean;
  error: unknown;
  search?: string;
  data: Readonly<SearchCardResponse> | null;
  table?: boolean;
  hide?: readonly string[];
  onUserClick?: (id: UUIDString) => void;
  onCardClick: (id: UUIDString) => void;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<SearchCardRequest>> | StoreSetter<Readonly<SearchCardRequest>>;
}

export function CardsData(props: Readonly<CardsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? CardsTable : CardsList}
        search={props.search}
        data={props.data!}
        hideColumns={props.hide}
        onUserClick={props.onUserClick}
        onCardClick={props.onCardClick}
        onChangeParams={props.onChangeParams}
      />
    </Data>
  );
}
