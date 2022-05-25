import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { useBool } from '_common/utils/useBool';
import { Divider } from '_common/components/Divider';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import type { Allocation } from 'generated/capital';

import { LimitedList } from './LimitedList';
import { CHILD_PADDING_PX } from './constants';

import css from './ArchivedList.css';

interface ArchivedListProps {
  currentID: string;
  items: readonly Readonly<Allocation>[];
  itemClass?: string;
  onSelect: (id: string) => void;
}

export function ArchivedList(props: Readonly<ArchivedListProps>) {
  const items = createMemo(() => props.items.filter((item) => item.archived));
  const [expanded, toggle] = useBool(items().some((item) => item.allocationId === props.currentID));

  return (
    <Show when={Boolean(items().length)}>
      <Divider class={css.divider} />
      <Button view="ghost" class={join(css.button, expanded() && css.expanded)} onClick={() => toggle()}>
        <span class={css.content}>
          <Icon name="archive" />
          <Text message="Archived" />
          <Icon name="chevron-right" class={css.more} />
        </span>
      </Button>
      <Show when={expanded()}>
        <LimitedList
          items={items()}
          padding={CHILD_PADDING_PX}
          currentID={props.currentID}
          itemClass={props.itemClass}
          onSelect={props.onSelect}
        />
      </Show>
    </Show>
  );
}
