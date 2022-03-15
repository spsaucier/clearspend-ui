import { createSignal, createMemo, Show, For } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { useI18n, Text } from 'solid-i18n';

import { InputSearch } from '_common/components/InputSearch';
import { Divider } from '_common/components/Divider';
import { Button } from '_common/components/Button';
import type { Allocation } from 'generated/capital';
import { getAllocationPermissions } from 'app/services/permissions';
import { useResource } from '_common/utils/useResource';
import { useDeferEffect } from '_common/utils/useDeferEffect';

import { getRootAllocation } from '../../utils/getRootAllocation';
import { byName } from '../AllocationSelect/utils';
import { canManageFunds } from '../../utils/permissions';

import { Item } from './Item';
import { List } from './List';

import css from './AllocationsSide.css';

interface AllocationsSideProps {
  currentID: string;
  items: readonly Readonly<Allocation>[];
  onSelect: (id: string) => void;
}

export function AllocationsSide(props: Readonly<AllocationsSideProps>) {
  const i18n = useI18n();
  const navigate = useNavigate();

  const [search, setSearch] = createSignal('');
  const root = createMemo(() => getRootAllocation(props.items));

  const [userPermissions, , , setAllocationIdForPermissions] = useResource(
    getAllocationPermissions,
    props.currentID,
    Boolean(props.currentID),
  );

  useDeferEffect(
    () => {
      if (props.currentID) {
        setAllocationIdForPermissions(props.currentID);
      }
    },
    () => props.currentID,
  );

  const found = createMemo(() => {
    const target = search().toLowerCase();
    return target ? props.items.filter((item) => item.name.toLowerCase().includes(target)) : [];
  });

  return (
    <section class={css.root}>
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
                      onClick={props.onSelect}
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
                onClick={props.onSelect}
              />
              <Show when={Boolean(data.childrenAllocationIds?.length)}>
                <Divider class={css.divider} />
              </Show>
              <List
                currentID={props.currentID}
                parentID={data.allocationId}
                items={[...props.items].sort(byName)}
                itemClass={css.item}
                onSelect={props.onSelect}
              />
            </Show>
            <Show when={canManageFunds(userPermissions())}>
              <Button
                wide
                type="primary"
                icon="add"
                onClick={() => navigate('/allocations/edit', { state: { parentAllocationId: props.currentID } })}
              >
                <Text message="New Allocation" />
              </Button>
            </Show>
          </div>
        )}
      </Show>
    </section>
  );
}
