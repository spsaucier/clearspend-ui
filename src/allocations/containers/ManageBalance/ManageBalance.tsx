import { createSignal, createMemo, batch, Switch, Match, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Tab, TabList } from '_common/components/Tabs';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { makeTransaction } from 'app/services/businesses';
import { isBankAccount } from 'onboarding/components/BankAccounts';
import { getBankAccounts, bankTransaction } from 'onboarding/services/accounts';
import type { Allocation, BusinessFundAllocationResponse } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { ManageBalanceSuccess, ManageBalanceSuccessData } from '../../components/ManageBalanceSuccess';
import { AllocationView } from '../../components/AllocationView';
import { targetById, ManageBalanceForm } from '../../components/ManageBalanceForm';
import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { allocationWithID } from '../../utils/allocationWithID';
import { getParentsChain } from '../../utils/getParentsChain';

import css from './ManageBalance.css';

enum Tabs {
  add,
  remove,
}

interface ManageBalanceProps {
  allocationId: string;
  allocations: readonly Readonly<Allocation>[];
  onReload: () => Promise<unknown>;
  onClose: () => void;
}

export function ManageBalance(props: Readonly<ManageBalanceProps>) {
  const [tab, setTab] = createSignal(Tabs.add);

  const current = createMemo(() => props.allocations.find(allocationWithID(props.allocationId))!);
  const [successManageData, setSuccessManageData] = createSignal<Readonly<ManageBalanceSuccessData>>();

  const [accounts, accountsStatus, , , reloadAccounts] = useResource(
    getBankAccounts,
    undefined,
    !current().parentAllocationId,
  );

  const targets = createMemo(() => {
    const allocation = current();
    return [
      ...getParentsChain(props.allocations, allocation),
      ...((!allocation.parentAllocationId && accounts()) || []),
    ];
  });

  const onUpdate = async (id: string, amount: number) => {
    const target = targets().find(targetById(id))!;
    const targetIsBankAccount = isBankAccount(target) as boolean;
    const isWithdraw = tab() === Tabs.remove;

    const { name: targetName, allocationId: targetAllocationId } = target as Allocation;
    const { name: currentName, allocationId: sourceAllocationId } = current()!;

    const transactionResult = targetIsBankAccount
      ? await bankTransaction(isWithdraw ? 'WITHDRAW' : 'DEPOSIT', id, amount)
      : await makeTransaction({
          allocationIdFrom: isWithdraw ? sourceAllocationId : targetAllocationId,
          allocationIdTo: isWithdraw ? targetAllocationId : sourceAllocationId,
          amount: { currency: 'USD', amount },
        });

    await props.onReload();

    if (targetIsBankAccount) {
      if (isWithdraw) {
        sendAnalyticsEvent({ name: Events.WITHDRAW_CASH, data: { amount } });
      } else {
        sendAnalyticsEvent({ name: Events.DEPOSIT_CASH, data: { amount } });
      }
    } else {
      sendAnalyticsEvent({ name: Events.REALLOCATE_FUNDS, data: { amount } });
    }

    const currentAmount = getAvailableBalance(current()!);

    setSuccessManageData({
      amount,
      fromAmount: targetIsBankAccount
        ? isWithdraw
          ? currentAmount
          : 0
        : (transactionResult as BusinessFundAllocationResponse).ledgerBalanceFrom?.amount!,
      fromName: isWithdraw ? currentName : targetName,
      toName: isWithdraw ? targetName : currentName,
      toAmount: targetIsBankAccount
        ? isWithdraw
          ? 0
          : currentAmount
        : (transactionResult as BusinessFundAllocationResponse).ledgerBalanceTo?.amount!,
      involvesBank: targetIsBankAccount,
    });
  };

  return (
    <div class={css.root}>
      <Switch>
        <Match when={accountsStatus().error}>
          <LoadingError onReload={reloadAccounts} />
        </Match>
        <Match when={accountsStatus().loading}>
          <Loading />
        </Match>
        <Match when={current()}>
          <AllocationView name={current()!.name} amount={getAvailableBalance(current()!)} class={css.allocation} />
          <Show
            when={!successManageData()}
            fallback={
              <ManageBalanceSuccess
                {...successManageData()!}
                onClose={props.onClose}
                onAgain={() => {
                  batch(() => {
                    setTab(Tabs.add);
                    setSuccessManageData();
                  });
                }}
              />
            }
          >
            <TabList value={tab()} onChange={setTab}>
              <Tab value={Tabs.add}>
                <Text message="Add Balance" />
              </Tab>
              <Tab value={Tabs.remove}>
                <Text message="Remove Balance" />
              </Tab>
            </TabList>
            <Switch>
              <Match when={tab() === Tabs.add}>
                <ManageBalanceForm current={current()!} targets={targets()} onUpdate={onUpdate} />
              </Match>
              <Match when={tab() === Tabs.remove}>
                <ManageBalanceForm withdraw current={current()!} targets={targets()} onUpdate={onUpdate} />
              </Match>
            </Switch>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
