import { createMemo, For, Match, Show, Switch } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link } from 'solid-app-router';

import { join } from '_common/utils/join';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';
import { useBusiness } from 'app/containers/Main/context';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import type { CardDetailsResponse, CardAllocationSpendControls, User } from 'generated/capital';
import { CardType } from 'cards/types';
import { i18n } from '_common/api/intl';
import { Select, Option } from '_common/components/Select';

import { BalanceInfo } from '../BalanceInfo';

import css from './CardInfo.css';

interface CardInfoProps {
  rowView?: boolean;
  limits?: CardAllocationSpendControls[];
  cardData: CardDetailsResponse | null;
  user: Readonly<User | null>;
  allocationId: string | undefined;
  class?: string;
  onUpdateLinkedAllocation?: (id: string, name: string) => void;
}

export function CardInfo(props: Readonly<CardInfoProps>) {
  const data = createMemo(() => props.cardData);
  const { allocations, currentUser } = useBusiness();
  const limits = props.limits?.find((l) => l.allocationId === data()?.linkedAllocationId)?.limits?.[0]?.typeMap
    .PURCHASE;

  const allocation = createMemo(() => allocations().find(allocationWithID(props.allocationId)));
  const parentAllocation = createMemo(() => allocations().find(allocationWithID(allocation()?.parentAllocationId)));

  const cardAllocations = createMemo(() =>
    data()?.allocationSpendControls?.map((c) => ({ name: c.allocationName!, allocationId: c.allocationId! })),
  );

  return (
    <div class={join(css.root, props.rowView && css.rowView, props.class)}>
      <div class={css.item}>
        <h4 class={css.title}>
          <Show when={data()?.card.type === CardType.PHYSICAL} fallback={<Text message="Allocation" />}>
            <Text message="Active Allocation" />
          </Show>
        </h4>
        <Switch
          fallback={
            <div class={css.value}>
              <strong class={css.name}>{data()?.linkedAllocationName}</strong>
            </div>
          }
        >
          <Match
            when={
              currentUser().userId === data()?.card.userId &&
              data()?.card.type === CardType.PHYSICAL &&
              cardAllocations() &&
              cardAllocations()!.length > 1 &&
              props.onUpdateLinkedAllocation
            }
          >
            <Select
              name="allocation"
              value={data()?.linkedAllocationId}
              placeholder={String(i18n.t('Select source of funds'))}
              valueRender={(id) => cardAllocations()?.find((a) => a.allocationId === id)?.name}
              class={css.allocationSelect}
              onChange={(id) =>
                props.onUpdateLinkedAllocation?.(id, cardAllocations()?.find((a) => a.allocationId === id)?.name || '')
              }
            >
              <For each={cardAllocations()}>
                {(item) => (
                  <Option value={item.allocationId} disabled={data()?.linkedAllocationId === item.allocationId}>
                    <span>{item.name}</span>
                  </Option>
                )}
              </For>
            </Select>
            <Show when={parentAllocation()}>
              <span class={css.note}>{parentAllocation()!.name}</span>
            </Show>
          </Match>
          <Match when={allocation()}>
            <>
              <Link class={css.value} href={`/allocations/${allocation()!.allocationId}`}>
                <strong class={css.name}>{allocation()!.name}</strong>
                <Icon name="chevron-right" class={css.chevron} />
              </Link>
              <Show when={parentAllocation()}>
                <span class={css.note}>{parentAllocation()!.name}</span>
              </Show>
            </>
          </Match>
        </Switch>
      </div>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Available Balance" />
        </h4>
        <Switch
          fallback={
            <div class={css.value}>
              <strong>{formatCurrency(data()?.availableBalance?.amount || 0)}</strong>
              <BalanceInfo />
            </div>
          }
        >
          <Match when={data()?.card.status === 'CANCELLED'}>
            <div class={css.value}>
              <strong>
                <Text message="N/A" />
              </strong>
            </div>
          </Match>
        </Switch>
        <div class={css.note}>
          <Show when={limits?.INSTANT?.amount}>
            <Text message="Transaction limit: {amount}" amount={formatCurrency(limits?.INSTANT?.amount || 0)} />
          </Show>
          <Show when={limits?.DAILY?.amount}>
            <div>
              <Text message="Daily limit: " />
              <span>{`${
                limits?.DAILY?.usedAmount ? `${formatCurrency(limits.DAILY.usedAmount || 0)} / ` : ''
              }${formatCurrency(limits?.DAILY?.amount || 0)}`}</span>
            </div>
          </Show>
          <Show when={limits?.MONTHLY?.amount}>
            <div>
              <Text message="30-day limit: " />
              <span>{`${
                limits?.MONTHLY?.usedAmount ? `${formatCurrency(limits.MONTHLY.usedAmount || 0)} / ` : ''
              }${formatCurrency(limits?.MONTHLY?.amount || 0)}`}</span>
            </div>
          </Show>
        </div>
      </div>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Employee" />
        </h4>
        <Link class={css.value} href={`/employees/view/${props.user?.userId}`}>
          <strong class={css.name}>{formatName(props.user!)}</strong>
          <Icon name="chevron-right" class={css.chevron} />
        </Link>
        <span class={join(css.note, 'fs-mask')}>{props.user?.email}</span>
      </div>
    </div>
  );
}
