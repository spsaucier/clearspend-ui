import { createSignal, Index, Show, batch } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import type { ILineChartData } from '_common/components/Charts';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { AccountActivityRequest, AccountActivityResponse, ChartDataRequest } from 'generated/capital';
import { Data } from 'app/components/Data';
import { TagOption, TagSelect } from 'app/components/TagSelect';
import { TransactionPreview } from 'transactions/components/TransactionPreview/TransactionPreview';
import { Drawer } from '_common/components/Drawer';
import { useNav } from '_common/api/router';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';
import { useSpending } from '../../stores/spending';
import { useActivity } from '../../stores/activity';

import { getLineData } from './mock';
import { TimePeriod, getTimePeriod, toISO } from './utils';

import css from './Overview.css';

const DEFAULT_SPENDING_PARAMS: ChartDataRequest = {
  ...toISO(getTimePeriod(TimePeriod.week)),
  chartFilter: 'ALLOCATION',
};

const DEFAULT_ACTIVITY_PARAMS: AccountActivityRequest = {
  ...toISO(getTimePeriod(TimePeriod.week)),
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

const PERIOD_OPTIONS: readonly Readonly<TagOption>[] = [
  { key: TimePeriod.week, text: i18n.t('This Week') },
  { key: TimePeriod.month, text: i18n.t('This Month') },
  { key: TimePeriod.quarter, text: i18n.t('This Quarter') },
  { key: TimePeriod.year, text: i18n.t('This Year') },
  { key: TimePeriod.today, text: i18n.t('Today') },
];

export function Overview() {
  const media = useMediaContext();
  const navigate = useNav();

  const [period, setPeriod] = createSignal<TimePeriod>(TimePeriod.week);

  const [data, setData] = createSignal<readonly ILineChartData[]>(getLineData());
  const spendingStore = useSpending({ params: DEFAULT_SPENDING_PARAMS });
  const activityStore = useActivity({ params: DEFAULT_ACTIVITY_PARAMS });

  const [selectTransaction, setSelectedTransaction] = createSignal<AccountActivityResponse | null>(null);

  const changePeriod = (value: TimePeriod) => {
    setPeriod(value);
    setData(getLineData());

    batch(() => {
      const range = toISO(getTimePeriod(value));
      spendingStore.setParams((prev) => ({ ...prev, ...range }));
      activityStore.setParams((prev) => ({ ...prev, ...range }));
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
        <SpendWidget
          data={data()}
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
          <TransactionPreview transaction={selectTransaction()!} />
        </Drawer>
      </div>
    </div>
  );
}
