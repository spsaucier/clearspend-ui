import { createSignal, createMemo, Show, For } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { useI18n } from 'solid-i18n';

import { InputSearch } from '_common/components/InputSearch';
import { Divider } from '_common/components/Divider';
import type { Allocation } from 'generated/capital';

import { getRootAllocation } from '../../utils/getRootAllocation';
import { useMediaContext } from '../../../_common/api/media/context';
import { AllocationSelect } from '../AllocationSelect';
import { canManageCards } from '../../utils/permissions';
import { createSortedNestedArray, parentsChain } from '../AllocationSelect/utils';

import { Item } from './Item';
import { List } from './List';

import css from './AllocationsSide.css';

interface AllocationsSideProps {
  currentID: string;
  items: readonly Readonly<Allocation>[] | null;
  onAllocationChange: () => void;
}

const PX_INDENT = 15;

export function AllocationsSide(props: Readonly<AllocationsSideProps>) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const media = useMediaContext();

  const [search, setSearch] = createSignal('');
  const root = createMemo(() => getRootAllocation(props.items));

  const found = createMemo(() => {
    const target = search().toLowerCase();
    return target && props.items ? props.items.filter((item) => item.name.toLowerCase().includes(target)) : [];
  });

  const allocations = createMemo(() => {
    if (getRootAllocation(props.items)) {
      return createSortedNestedArray(props.items);
    }
    return props.items?.map((a) => ({ ...a, nestLevel: parentsChain(a, [...props.items!]).length })) || [];
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
            <Show when={root()}>
              <InputSearch delay={300} placeholder={String(i18n.t('Search Allocations...'))} onSearch={setSearch} />
            </Show>
          </header>
          <Show
            when={root()}
            fallback={
              <For each={allocations()}>
                {(item) => (
                  <Item
                    data={item}
                    active={props.currentID === item.allocationId}
                    class={css.item}
                    onClick={props.onAllocationChange}
                    title={
                      <span style={{ 'padding-left': `${PX_INDENT * Math.max(item.nestLevel - 1, 0)}px` }}>
                        {item.name}
                      </span>
                    }
                  />
                )}
              </For>
            }
          >
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
                    items={props.items!}
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
