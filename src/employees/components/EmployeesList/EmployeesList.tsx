import { For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import type { Setter } from '_common/types/common';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { PagedDataUserPageData, SearchUserRequest } from 'generated/capital';
import { InputSearch } from '_common/components/InputSearch';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';

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
      <InputSearch
        delay={400}
        onSearch={changeRequestSearch(props.onChangeParams)}
        placeholder="Search employees..."
        class={css.search}
      />
      <For each={props.data.content}>
        {(item) => {
          const [card, ...rest] = item.cardInfoList || [];

          return (
            <div class={css.item} onClick={() => props.onClick(item.userData?.userId || '')}>
              <div>
                <div class={css.name}>{formatName(item.userData)}</div>
                <div class="fs-mask">{item.email}</div>
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
