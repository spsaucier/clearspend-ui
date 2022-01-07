import { createSignal, Index, Show, batch, createEffect, on } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type {
  AccountActivityResponse,
  GraphDataRequest,
  ChartDataRequest,
  AccountActivityRequest,
} from 'generated/capital';
import { Data } from 'app/components/Data';
import { TagOption, TagSelect } from 'app/components/TagSelect';
import { TransactionPreview } from 'transactions/components/TransactionPreview/TransactionPreview';
import { Drawer } from '_common/components/Drawer';
import { useNav } from '_common/api/router';
import { Modal } from '_common/components/Modal/Modal';
import { ReceiptsView, ReceiptVideModel } from 'transactions/components/TransactionPreview/ReceiptsView';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';
import { useSpend } from '../../stores/spend';
import { useSpending } from '../../stores/spending';
import { useActivity } from '../../stores/activity';

import { TimePeriod, getTimePeriod, toISO, updateParams } from './utils';

import css from './Overview.css';

const PERIOD_OPTIONS: readonly Readonly<TagOption>[] = [
  { key: TimePeriod.week, text: i18n.t('This Week') },
  { key: TimePeriod.month, text: i18n.t('This Month') },
  { key: TimePeriod.quarter, text: i18n.t('This Quarter') },
  { key: TimePeriod.year, text: i18n.t('This Year') },
  { key: TimePeriod.today, text: i18n.t('Today') },
];

interface OverviewProps {
  allocationId: string | undefined;
}

export function Overview(props: Readonly<OverviewProps>) {
  const media = useMediaContext();
  const navigate = useNav();

  const PERIOD = toISO(getTimePeriod(TimePeriod.week));
  const [period, setPeriod] = createSignal<TimePeriod>(TimePeriod.week);

  const spendStore = useSpend({ params: { ...PERIOD, allocationId: props.allocationId } });

  const spendingStore = useSpending({
    params: {
      ...PERIOD,
      allocationId: props.allocationId,
      chartFilter: 'ALLOCATION',
    },
  });

  const activityStore = useActivity({
    params: {
      ...PERIOD,
      allocationId: props.allocationId,
      pageRequest: { pageNumber: 0, pageSize: 10 },
    },
  });

  createEffect(
    on(
      [() => props.allocationId],
      (input) => {
        const updates = { allocationId: props.allocationId };
        spendStore.setParams(updateParams<GraphDataRequest>(updates));
        spendingStore.setParams(updateParams<ChartDataRequest>(updates));
        activityStore.setParams(updateParams<AccountActivityRequest>(updates));
        return input;
      },
      { defer: true },
    ),
  );

  const [selectTransaction, setSelectedTransaction] = createSignal<AccountActivityResponse | null>(null);
  const [showReceipts, setShowReceipts] = createSignal<Readonly<ReceiptVideModel[]>>([]);

  const changePeriod = (value: TimePeriod) => {
    setPeriod(value);

    batch(() => {
      const range = toISO(getTimePeriod(value));
      spendStore.setParams(updateParams<GraphDataRequest>(range));
      spendingStore.setParams(updateParams<ChartDataRequest>(range));
      activityStore.setParams(updateParams<AccountActivityRequest>(range));
    });
  };

  return (
    <div class={css.root}>
      <Show when={!media.small}>
        <TabList value={period()} onChange={changePeriod}>
          <Index each={PERIOD_OPTIONS}>{(option) => <Tab value={option().key}>{option().text}</Tab>}</Index>
        </TabList>
      </Show>
      <div class={css.top}>
        <Data error={spendStore.error} loading={spendStore.loading} data={spendStore.data} onReload={spendStore.reload}>
          <SpendWidget
            period={period()}
            data={spendStore.data!}
            controls={
              <Show when={media.small}>
                <TagSelect
                  class={css.fullWidthDropdown}
                  value={period()}
                  options={PERIOD_OPTIONS}
                  onChange={(timePeriod) => changePeriod(timePeriod as TimePeriod)}
                />
              </Show>
            }
          />
        </Data>
        <Data
          data={spendingStore.data}
          error={spendingStore.error}
          loading={spendingStore.loading}
          onReload={spendingStore.reload}
        >
          <SpendingByWidget
            loading={spendingStore.loading}
            data={spendingStore.data!}
            params={spendingStore.params}
            onFilterChange={(chartFilter) =>
              spendingStore.setParams((prev) => ({ ...prev, chartFilter } as ChartDataRequest))
            }
          />
        </Data>
      </div>
      <div>
        <h3 class={css.transactionTitle}>
          <Text message="Recent Transactions" />
        </h3>
        <Data
          data={activityStore.data}
          loading={activityStore.loading}
          error={activityStore.error}
          onReload={activityStore.reload}
        >
          <TransactionsData
            table={media.large}
            loading={activityStore.loading}
            error={activityStore.error}
            search={activityStore.params.searchText}
            data={activityStore.data}
            onReload={activityStore.reload}
            onChangeParams={activityStore.setParams}
            onReceiptClick={setSelectedTransaction}
            onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
          />
        </Data>
        <Drawer
          open={Boolean(selectTransaction())}
          title={<Text message="Transaction Details" />}
          onClose={() => setSelectedTransaction(null)}
        >
          <TransactionPreview transaction={selectTransaction()!} onViewReceipt={setShowReceipts} />
        </Drawer>
        <Modal isOpen={showReceipts().length > 0} close={() => setShowReceipts([])}>
          <ReceiptsView receipts={showReceipts()} />
        </Modal>
      </div>
    </div>
  );
}
