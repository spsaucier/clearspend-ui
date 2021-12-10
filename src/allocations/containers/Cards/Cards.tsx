import { createMemo, createSignal, createEffect, untrack } from 'solid-js';
import { Show } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { CardsData } from 'cards/components/CardsData';
import { CardPreview } from 'cards/containers/CardPreview';
import { searchCards } from 'cards/services';
import { EmployeePreview } from 'employees/containers/EmployeePreview';
import type { UUIDString } from 'app/types/common';
import type { Allocation, SearchCardRequest } from 'generated/capital';

import { AllocationBalances } from '../../components/AllocationBalances';
import { allocationWithID } from '../../utils/allocationWithID';

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

  const [cardID, setCardID] = createSignal<UUIDString | null>(null);
  const [userID, setUserID] = createSignal<UUIDString | null>(null);

  const children = createMemo(() =>
    props.current.childrenAllocationIds?.map((id) => props.items.find(allocationWithID(id))!),
  );

  const [cards, status, params, setParams, reload] = useResource(searchCards, {
    ...DEFAULT_PARAMS,
    allocationId: props.current.allocationId,
  });

  createEffect(() => {
    if (untrack(params).allocationId === props.current.allocationId) return;

    setParams((prev) => ({
      ...prev,
      allocationId: props.current.allocationId,
      searchText: '',
    }));
  });

  return (
    <>
      <Show when={children()?.length}>
        <AllocationBalances current={props.current} items={children() || []} />
        <h3 class={css.title}>
          <Text message="Cards" />
        </h3>
      </Show>
      <CardsData
        table={media.wide}
        loading={status().loading}
        error={status().error}
        search={params().searchText}
        data={cards()}
        hide={['allocation']}
        onReload={reload}
        onCardClick={setCardID}
        onUserClick={setUserID}
        onChangeParams={setParams}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
      <Drawer open={Boolean(userID())} title={<Text message="Employee Profile" />} onClose={() => setUserID(null)}>
        <EmployeePreview uid={userID()!} />
      </Drawer>
    </>
  );
}
