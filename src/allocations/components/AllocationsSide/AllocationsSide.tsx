import { createSignal, createMemo, Show, For } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { useI18n } from 'solid-i18n';

import { InputSearch } from '_common/components/InputSearch';
import { Divider } from '_common/components/Divider';
import type { AccessibleAllocation } from 'allocations/types';

import { getRootAllocation } from '../../utils/getRootAllocation';
import { useMediaContext } from '../../../_common/api/media/context';
import { AllocationSelect } from '../AllocationSelect';
import { byName } from '../AllocationSelect/utils';
import { canManageCards } from '../../utils/permissions';

import { Item } from './Item';
import { List } from './List';

import css from './AllocationsSide.css';

interface AllocationsSideProps {
  currentID: string;
  items: readonly Readonly<AccessibleAllocation>[] | null;
  onAllocationChange: () => void;
}

export function AllocationsSide(props: Readonly<AllocationsSideProps>) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const media = useMediaContext();

  const [search, setSearch] = createSignal('');
  const root = createMemo(() => getRootAllocation(props.items));
  const sortedItems = createMemo(() => (props.items ? [...props.items].sort(byName) : []));

  const found = createMemo(() => {
    const target = search().toLowerCase();
    return target ? sortedItems().filter((item) => item.name.toLowerCase().includes(target)) : [];
  });

  return (
    <section class={css.root}>
      <Show
        when={media.large}
        fallback={
          <header class={css.header}>
            <h3 class={css.title}>Allocations</h3>
            <AllocationSelect
              items={props.items}
              value={props.currentID}
              onChange={(id) => {
                props.onAllocationChange();
                navigate(`/allocations/${id}`);
              }}
              permissionCheck={canManageCards}
            />
          </header>
        }
      >
        <>
          <header class={css.header}>
            <h3 class={css.title}>Allocations</h3>
            <InputSearch delay={300} placeholder={String(i18n.t('Search Allocations...'))} onSearch={setSearch} />
          </header>
          <Show when={root()}>
            {(data) => (
              <div class={css.content}>
                <Show
                  when={!search()}
                  fallback={
                    <For each={found()}>
                      {(item) => (
                        <Item
                          root={!item.parentAllocationId}
                          data={item}
                          active={props.currentID === item.allocationId}
                          class={css.item}
                          onClick={props.onAllocationChange}
                        />
                      )}
                    </For>
                  }
                >
                  <Item
                    root
                    data={data}
                    active={props.currentID === data.allocationId}
                    class={css.item}
                    onClick={props.onAllocationChange}
                  />
                  <Show when={Boolean(data.childrenAllocationIds?.length)}>
                    <Divider class={css.divider} />
                  </Show>
                  <List
                    currentID={props.currentID}
                    parentID={data.allocationId}
                    items={sortedItems()}
                    itemClass={css.item}
                    onSelect={props.onAllocationChange}
                  />
                </Show>
              </div>
            )}
          </Show>
        </>
      </Show>
    </section>
  );
}
