import { For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import type { Setter } from '_common/types/common';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { PagedDataUserPageData, SearchUserRequest } from 'generated/capital';

import { formatName } from '../../utils/formatName';

import css from './EmployeesList.css';

interface EmployeesListProps {
  data: PagedDataUserPageData;
  onClick: (uid: string) => void;
  onChangeParams: Setter<Readonly<SearchUserRequest>>;
}

export function EmployeesList(props: Readonly<EmployeesListProps>) {
  return (
    <div>
      <Input disabled placeholder="Search employees..." suffix={<Icon name="search" size="sm" />} class={css.search} />
      <For each={props.data.content}>
        {(item) => {
          const [card, ...rest] = item.cardInfoList || [];

          return (
            <div class={css.item} onClick={() => props.onClick(item.userData?.userId || '')}>
              <div>
                <div class={css.name}>{formatName(item.userData)}</div>
                <div>{item.email}</div>
              </div>
              <div class={css.cards}>
                <Show when={card} fallback={<Text message="No card" />}>
                  <div class={css.card}>{formatCardNumber(card!.lastFour, true)}</div>
                  <Show when={Boolean(rest.length)} fallback={<span class={css.more}>{card!.allocationName}</span>}>
                    <Text
                      message="{count} more {count, plural, one {card} other {cards}}"
                      count={rest.length}
                      class={css.more!}
                    />
                  </Show>
                </Show>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
