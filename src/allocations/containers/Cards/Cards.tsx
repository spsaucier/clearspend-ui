import { createMemo, createSignal, createEffect, on } from 'solid-js';
import { Show } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { storage } from '_common/api/storage';
import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { Drawer } from '_common/components/Drawer';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { CardsData } from 'cards/components/CardsData';
import { CardPreview } from 'cards/containers/CardPreview';
import { CARDS_PAGE_SIZE_STORAGE_KEY, DEFAULT_CARD_PARAMS } from 'cards/constants';
import { searchCards } from 'cards/services';
import { EmployeePreview } from 'employees/containers/EmployeePreview';
import type { Allocation, SearchCardRequest } from 'generated/capital';

import { AllocationBalances } from '../../components/AllocationBalances';
import { getAvailableBalance } from '../../utils/getAvailableBalance';

import css from './Cards.css';

interface CardsProps {
  current: Readonly<Allocation>;
  allocations: readonly Readonly<Allocation>[];
  setCardsCount?: (count: number | undefined) => void;
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();

  const [cardID, setCardID] = createSignal<string | null>(null);
  const [userID, setUserID] = createSignal<string | null>(null);

  const [cards, status, params, setParams, reload] = useResource(searchCards, {
    ...extendPageSize(DEFAULT_CARD_PARAMS, storage.get(CARDS_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
    allocations: [props.current.allocationId],
  } as SearchCardRequest);

  createEffect(() => {
    props.setCardsCount?.(cards()?.totalElements);
  });

  createEffect(
    on(
      () => props.current,
      (current, prev: Allocation | undefined) => {
        if (current.allocationId === prev?.allocationId && getAvailableBalance(current) !== getAvailableBalance(prev)) {
          reload();
        }
      },
    ),
  );

  createEffect(
    on(
      createMemo(() => props.current.allocationId),
      (allocationId) => {
        if (allocationId === params().allocations?.[0]) return;
        setParams((data) => ({ ...data, allocations: [allocationId], searchText: '' }));
      },
    ),
  );

  return (
    <>
      <Show when={Boolean(props.current.childrenAllocationIds?.length)}>
        <AllocationBalances current={props.current} allocations={props.allocations} />
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
        omitFilters={['allocations']}
        onReload={reload}
        onCardClick={setCardID}
        onUserClick={setUserID}
        params={params()}
        onChangeParams={onPageSizeChange(setParams, (size) => storage.set(CARDS_PAGE_SIZE_STORAGE_KEY, size))}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
      <Drawer
        open={Boolean(userID())}
        title={<Text message="Employee Profile" />}
        onClose={() => setUserID(null)}
        noPadding={true}
      >
        <EmployeePreview uid={userID()!} />
      </Drawer>
    </>
  );
}
