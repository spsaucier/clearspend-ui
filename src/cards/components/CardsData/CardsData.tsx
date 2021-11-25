import { Dynamic } from 'solid-js/web';

import { Data } from 'app/components/Data';
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
  onSearch: (value: string) => void;
  onUserClick?: (id: UUIDString) => void;
  onCardClick: (id: UUIDString) => void;
  onReload: () => Promise<unknown>;
}

export function CardsData(props: Readonly<CardsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? CardsTable : CardsList}
        data={props.data!}
        hideColumns={props.hide}
        onSearch={props.onSearch}
        onUserClick={props.onUserClick}
        onCardClick={props.onCardClick}
      />
    </Data>
  );
}
