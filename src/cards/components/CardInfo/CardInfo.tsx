import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link } from 'solid-app-router';

import { join } from '_common/utils/join';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import type { Allocation, CardDetailsResponse, CurrencyLimit, User } from 'generated/capital';
import { useAllocations } from 'allocations/stores/allocations';
import type { Store } from '_common/utils/store';

import { BalanceInfo } from '../BalanceInfo';
import { hasSomeManagerRole } from '../../../allocations/utils/permissions';
import { useBusiness } from '../../../app/containers/Main/context';

import css from './CardInfo.css';

interface CardInfoProps {
  limits?: CurrencyLimit[];
  cardData: CardDetailsResponse | null;
  user: Readonly<User | null>;
  allocationId: string | undefined;
  class?: string;
}

export function CardInfo(props: Readonly<CardInfoProps>) {
  const { currentUserRoles } = useBusiness();
  const limits = props.limits?.[0]?.typeMap.PURCHASE;

  let allocations: Store<readonly Readonly<Allocation>[], unknown> = {
      data: null,
      loading: false,
      error: undefined,
      params: undefined,
      reload: function (): Promise<unknown> {
        throw new Error('Function not implemented.');
      },
      setData: function (): void {
        throw new Error('Function not implemented.');
      },
      setParams: function (): void {
        throw new Error('Function not implemented.');
      },
    },
    allocation;
  if (hasSomeManagerRole(currentUserRoles())) {
    allocations = useAllocations();
    if (allocations.data) {
      allocation = createMemo(
        () => allocations.data?.find(allocationWithID(props.allocationId)) as Allocation | undefined,
      );
    }
  }
  return (
    <div class={join(css.root, props.class)}>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Available Balance" />
        </h4>
        <div class={css.value}>
          <strong>{formatCurrency(props.cardData?.availableBalance.amount || 0)}</strong>
          <BalanceInfo />
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
              <Text message="Monthly limit: " />
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
          when={allocation?.()}
          fallback={
            <div class={css.value}>
              <strong class={css.name}>{props.cardData?.allocationName}</strong>
            </div>
          }
        >
          <>
            <Link class={css.value} href={`/allocations/${props.allocationId}`}>
              <strong class={css.name}>{allocation?.()?.name}</strong>
              <Icon name="chevron-right" class={css.chevron} />
            </Link>
            <Show when={allocation?.()?.parentAllocationId}>
              <span class={css.note}>
                {allocations.data?.find(allocationWithID(allocation?.()?.parentAllocationId))?.name}
              </span>
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
