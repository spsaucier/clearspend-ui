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
import {
  ManageBalanceSuccess,
  ManageBalanceSuccessData,
} from 'allocations/components/ManageBalanceSuccess/ManageBalanceSuccess';

import { AllocationView } from '../../components/AllocationView';
import { targetById, ManageBalanceForm } from '../../components/ManageBalanceForm';
import { useAllocations } from '../../stores/allocations';
import { allocationWithID } from '../../utils/allocationWithID';
import { getParentsChain } from '../../utils/getParentsChain';

import css from './ManageBalance.css';

enum Tabs {
  add,
  remove,
}

interface ManageBalanceProps {
  allocationId: string;
  onReload: () => Promise<unknown>;
  onClose: () => void;
}

export function ManageBalance(props: Readonly<ManageBalanceProps>) {
  const [tab, setTab] = createSignal(Tabs.add);

  const [current, setCurrent] = createSignal<Readonly<Allocation>>();
  const [manageBalanceSucessData, setManageBalanceSuccessData] = createSignal<Readonly<ManageBalanceSuccessData>>();

  const [accounts, accountsRequestStatus, , , reloadAccounts] = useResource(getBankAccounts, undefined, false);

  const allocations = useAllocations({
    initValue: [],
    onSuccess: (data) => {
      const found = data.find(allocationWithID(props.allocationId));
      if (found && !found.parentAllocationId) reloadAccounts();
      setCurrent(found);
    },
  });

  // TODO: check user role (owner|manager?)

  const targets = createMemo(() => {
    const allocation = current();
    return [
      ...getParentsChain(allocations.data!, allocation),
      ...((!allocation?.parentAllocationId && accounts()) || []),
    ];
  });

  const onUpdate = async (id: string, amount: number) => {
    const target = targets().find(targetById(id))!;
    const targetIsBankAccount = isBankAccount(target) as boolean;
    const isWithdraw = tab() === Tabs.remove;

    const { name: targetName, allocationId: targetAllocationId } = target as Allocation;
    const { name: currentName, allocationId: sourceAllocationId, account } = current()!;

    const transactionResult = targetIsBankAccount
      ? await bankTransaction(isWithdraw ? 'WITHDRAW' : 'DEPOSIT', id, amount)
      : await makeTransaction({
          allocationIdFrom: isWithdraw ? sourceAllocationId : targetAllocationId,
          allocationIdTo: isWithdraw ? targetAllocationId : sourceAllocationId,
          amount: { currency: 'USD', amount },
        });

    await props.onReload();

    setManageBalanceSuccessData({
      amount,
      fromAmount: targetIsBankAccount
        ? 0
        : (transactionResult as BusinessFundAllocationResponse).ledgerBalanceFrom?.amount!,
      fromName: isWithdraw ? currentName : targetName,
      toName: isWithdraw ? targetName : currentName,
      toAmount: targetIsBankAccount
        ? account.ledgerBalance.amount
        : (transactionResult as BusinessFundAllocationResponse).ledgerBalanceTo?.amount!,
    });
  };

  return (
    <div class={css.root}>
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={accountsRequestStatus().error}>
          <LoadingError onReload={reloadAccounts} />
        </Match>
        <Match when={allocations.loading}>
          <Loading />
        </Match>
        <Match when={current()}>
          <AllocationView
            name={current()!.name}
            amount={current()!.account.ledgerBalance.amount}
            class={css.allocation}
          />
          <Show
            when={!manageBalanceSucessData()}
            fallback={
              <ManageBalanceSuccess
                {...manageBalanceSucessData()!}
                onClose={props.onClose}
                onAgain={() => {
                  batch(() => {
                    setTab(Tabs.add);
                    setManageBalanceSuccessData();
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
