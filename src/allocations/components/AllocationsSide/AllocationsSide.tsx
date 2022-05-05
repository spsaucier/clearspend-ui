import { createSignal, createMemo, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { useI18n } from 'solid-i18n';

import { InputSearch } from '_common/components/InputSearch';
import { Divider } from '_common/components/Divider';
import type { Allocation } from 'generated/capital';

import { getRootAllocation } from '../../utils/getRootAllocation';
import { useMediaContext } from '../../../_common/api/media/context';
import { AllocationSelect } from '../AllocationSelect';
import { canManageCards } from '../../utils/permissions';

import { Item } from './Item';
import { List } from './List';
import { LimitedList } from './LimitedList';
import { getItemsByName } from './utils';

import css from './AllocationsSide.css';

interface AllocationsSideProps {
  currentID: string;
  items: readonly Readonly<Allocation>[];
  onAllocationChange: () => void;
}

export function AllocationsSide(props: Readonly<AllocationsSideProps>) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const media = useMediaContext();

  const [search, setSearch] = createSignal('');
  const root = createMemo(() => getRootAllocation(props.items));

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
          <div class={css.content}>
            <Switch>
              <Match when={search()}>
                {(text) => (
                  <LimitedList
                    currentID={props.currentID}
                    items={getItemsByName(props.items, text)}
                    itemClass={css.item}
                    onSelect={props.onAllocationChange}
                  />
                )}
              </Match>
              <Match when={root()}>
                {(data) => (
                  <>
                    <Item
                      data={data}
                      active={data.allocationId === props.currentID}
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
                  </>
                )}
              </Match>
              <Match when={!root()}>
                <LimitedList
                  currentID={props.currentID}
                  items={props.items}
                  itemClass={css.item}
                  onSelect={props.onAllocationChange}
                />
              </Match>
            </Switch>
          </div>
        </>
      </Show>
    </section>
  );
}
