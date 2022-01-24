import { createSignal, createMemo, batch, Switch, Match, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Tab, TabList } from '_common/components/Tabs';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { makeTransaction } from 'app/services/businesses';
import { isBankAccount } from 'onboarding/components/BankAccounts';
import { getBankAccounts, bankTransaction } from 'onboarding/services/accounts';
import type { Allocation } from 'generated/capital';

import { AllocationView } from '../../components/AllocationView';
import { targetById, ManageBalanceForm } from '../../components/ManageBalanceForm';
import { ManageBalanceSuccess, SuccessData } from '../../components/ManageBalanceSuccess';
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
  const [successData, setSuccessData] = createSignal<Readonly<SuccessData>>();

  const [accounts, aStatus, , , reloadAccounts] = useResource(getBankAccounts, undefined, false);

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

    isBankAccount(target)
      ? await bankTransaction(tab() === Tabs.add ? 'DEPOSIT' : 'WITHDRAW', id, amount)
      : await makeTransaction({
          allocationIdFrom: current()!.allocationId,
          allocationIdTo: target.allocationId,
          amount: { currency: 'USD', amount },
        });

    await props.onReload();
    setSuccessData({ amount, current: current()!, target, withdraw: tab() === Tabs.remove });
  };

  return (
    <div class={css.root}>
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={aStatus().error}>
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
            when={!successData()}
            fallback={
              <ManageBalanceSuccess
                data={successData()!}
                onClose={props.onClose}
                onAgain={() => {
                  batch(() => {
                    setTab(Tabs.add);
                    setSuccessData();
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
