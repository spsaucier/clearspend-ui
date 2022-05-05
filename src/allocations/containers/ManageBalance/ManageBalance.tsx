import { createSignal, createMemo, batch, Switch, Match, Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { isString } from '_common/utils/isString';
import { useResource } from '_common/utils/useResource';
import { Tab, TabList } from '_common/components/Tabs';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { makeTransaction } from 'app/services/businesses';
import { isBankAccount } from 'onboarding/components/Accounts';
import { getBankAccounts, bankTransaction } from 'onboarding/services/accounts';
import type { Allocation, BusinessFundAllocationResponse } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { useMessages } from 'app/containers/Messages/context';
import { isFetchError } from '_common/api/fetch/isFetchError';
import { i18n } from '_common/api/intl';

import { ManageBalanceSuccess, ManageBalanceSuccessData } from '../../components/ManageBalanceSuccess';
import { AllocationView } from '../../components/AllocationView';
import { targetById, ManageBalanceForm } from '../../components/ManageBalanceForm';
import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { allocationWithID } from '../../utils/allocationWithID';
import { useBusiness } from '../../../app/containers/Main/context';
import { allocationsWhereCanManageFunds } from '../../utils/permissions';

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
  const { currentUserRoles } = useBusiness();
  const [tab, setTab] = createSignal(Tabs.add);
  const messages = useMessages();
  const navigate = useNavigate();

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
      ...allocationsWhereCanManageFunds(
        props.allocations.filter((a) => a.allocationId !== allocation.allocationId),
        currentUserRoles(),
      ),
      ...((!allocation.parentAllocationId && accounts()) || []),
    ];
  });

  const onUpdate = async (id: string, amount: number) => {
    const target = targets().find(targetById(id))!;
    const targetIsBankAccount = isBankAccount(target) as boolean;
    const isWithdrawal = tab() === Tabs.remove;

    const { name: targetName, allocationId: targetAllocationId } = target as Allocation;
    const { name: currentName, allocationId: sourceAllocationId } = current()!;
    try {
      const transactionResult = targetIsBankAccount
        ? await bankTransaction(isWithdrawal ? 'WITHDRAW' : 'DEPOSIT', id, amount).catch((e: { status: number }) => {
            const withdrawalOrDeposit = isWithdrawal ? i18n.t('withdrawal') : i18n.t('deposit');
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (e.status === 428) {
              messages.error({
                title: i18n.t('Unable to complete {withdrawalOrDeposit}', {
                  withdrawalOrDeposit: String(withdrawalOrDeposit),
                }),
                message: i18n.t("You'll need to relink your bank account to make further {withdrawalOrDeposit}s", {
                  withdrawalOrDeposit: String(withdrawalOrDeposit),
                }),
              });
              navigate('/settings?tab=accounts&relink');
            } else if (isFetchError<{ message?: string }>(e)) {
              const message = e.data.message;
              if (isString(message)) {
                if (message.indexOf('exceeded allowed operation amount of limitType') > -1) {
                  const period = message.split('for period ')[1] || '';
                  messages.error({
                    title: i18n.t('Unable to complete {withdrawalOrDeposit}', {
                      withdrawalOrDeposit: String(withdrawalOrDeposit),
                    }),
                    message: `You have reached your ${period.toLowerCase()} ACH ${withdrawalOrDeposit} limit. Please contact help@clearspend.com for assistance.`,
                  });
                } else {
                  messages.error({
                    title: i18n.t('Unable to complete {withdrawalOrDeposit}', {
                      withdrawalOrDeposit: String(withdrawalOrDeposit),
                    }),
                    message,
                  });
                }
              }
            }
            throw new Error('Unable to complete bank transaction');
          })
        : await makeTransaction({
            allocationIdFrom: isWithdrawal ? sourceAllocationId : targetAllocationId,
            allocationIdTo: isWithdrawal ? targetAllocationId : sourceAllocationId,
            amount: { currency: 'USD', amount },
          }).catch((e: unknown) => {
            if (isFetchError<{ message?: string }>(e)) {
              const message = e.data.message;
              if (isString(message)) {
                messages.error({
                  title: `Unable to complete reallocation`,
                  message,
                });
              }
            }
            throw new Error('Unable to complete reallocation');
          });

      await props.onReload();

      if (targetIsBankAccount) {
        if (isWithdrawal) {
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
          ? isWithdrawal
            ? currentAmount
            : 0
          : (transactionResult as BusinessFundAllocationResponse).ledgerBalanceFrom?.amount!,
        fromName: isWithdrawal ? currentName : targetName,
        toName: isWithdrawal ? targetName : currentName,
        toAmount: targetIsBankAccount
          ? isWithdrawal
            ? 0
            : currentAmount
          : (transactionResult as BusinessFundAllocationResponse).ledgerBalanceTo?.amount!,
        involvesBank: targetIsBankAccount,
      });
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
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
