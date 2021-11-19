import { createMemo, Show } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Divider } from '_common/components/Divider';
import { Button } from '_common/components/Button';

import { getRootAllocation } from '../../utils/getRootAllocation';
import type { Allocation } from '../../types';

import { Item } from './Item';
import { List } from './List';

import css from './AllocationsSide.css';

interface AllocationsSideProps {
  currentID: Allocation['allocationId'];
  items: readonly Readonly<Allocation>[];
  onSelect: (id: Allocation['allocationId']) => void;
}

export function AllocationsSide(props: Readonly<AllocationsSideProps>) {
  const navigate = useNavigate();
  const root = createMemo(() => getRootAllocation(props.items));

  return (
    <section class={css.root}>
      <header class={css.header}>
        <h3 class={css.title}>Allocations</h3>
        <Input disabled placeholder="Search Allocations..." suffix={<Icon name="search" size="sm" />} />
      </header>
      <Show when={root()}>
        {(data) => (
          <div class={css.content}>
            <Item root data={data} active={props.currentID === data.allocationId} onClick={props.onSelect} />
            <Show when={data.childrenAllocationIds.length}>
              <Divider class={css.divider} />
            </Show>
            <List
              currentID={props.currentID}
              parentID={data.allocationId}
              items={props.items}
              onSelect={props.onSelect}
            />
            <Button wide type="primary" icon="add" onClick={() => navigate('/allocations/edit')}>
              New Allocation
            </Button>
          </div>
        )}
      </Show>
    </section>
  );
}
