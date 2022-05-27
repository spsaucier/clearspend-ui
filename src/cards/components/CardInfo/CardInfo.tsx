import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link } from 'solid-app-router';

import { join } from '_common/utils/join';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';
import { useBusiness } from 'app/containers/Main/context';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import type { CurrencyLimit, User } from 'generated/capital';

import type { LegacyCardDetailsResponse } from '../../types';
import { BalanceInfo } from '../BalanceInfo';

import css from './CardInfo.css';

interface CardInfoProps {
  rowView?: boolean;
  limits?: CurrencyLimit[];
  cardData: LegacyCardDetailsResponse | null;
  user: Readonly<User | null>;
  allocationId: string | undefined;
  class?: string;
}

export function CardInfo(props: Readonly<CardInfoProps>) {
  const { allocations } = useBusiness();
  const limits = props.limits?.[0]?.typeMap.PURCHASE;

  const allocation = createMemo(() => allocations().find(allocationWithID(props.allocationId)));
  const parentAllocation = createMemo(() => allocations().find(allocationWithID(allocation()?.parentAllocationId)));

  return (
    <div class={join(css.root, props.rowView && css.rowView, props.class)}>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Available Balance" />
        </h4>
        <div class={css.value}>
          <Show
            when={props.cardData?.card.status !== 'CANCELLED'}
            fallback={
              <strong>
                <Text message="N/A" />
              </strong>
            }
          >
            <>
              <strong>{formatCurrency(props.cardData?.availableBalance?.amount || 0)}</strong>
              <BalanceInfo />
            </>
          </Show>
        </div>
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
          <Text message="Allocation" />
        </h4>
        <Show
          when={allocation()}
          fallback={
            <div class={css.value}>
              <strong class={css.name}>{props.cardData?.allocationName}</strong>
            </div>
          }
        >
          <>
            <Link class={css.value} href={`/allocations/${allocation()!.allocationId}`}>
              <strong class={css.name}>{allocation()!.name}</strong>
              <Icon name="chevron-right" class={css.chevron} />
            </Link>
            <Show when={parentAllocation()}>
              <span class={css.note}>{parentAllocation()!.name}</span>
            </Show>
          </>
        </Show>
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
