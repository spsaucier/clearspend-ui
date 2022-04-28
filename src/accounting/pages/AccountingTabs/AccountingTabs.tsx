import { createSignal, Switch, Match, onMount, Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate, useSearchParams } from 'solid-app-router';

import { storage } from '_common/api/storage';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { useActivity } from 'app/stores/activity';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { dateRangeToISO } from 'app/utils/dateRangeToISO';
import { Data } from 'app/components/Data';
import { usePageTabs } from 'app/utils/usePageTabs';
import { AccountingSettings } from 'accounting/containers/AccountingSettings';
import { SyncLog } from 'accounting/containers/SyncLog';
import { AccountingTimePeriod, getAccountingTimePeriod } from 'accounting/pages/AccountingTabs/utils';
import { AccountingOverview } from 'accounting/containers/AccountingOverview';
import { ACTIVITY_PAGE_SIZE_STORAGE_KEY, ACCOUNTING_TRANSACTIONS_PARAMS } from 'transactions/constants';
import { useBusiness } from 'app/containers/Main/context';
import { AccountSetupStep } from 'app/types/businesses';
import { useMessages } from 'app/containers/Messages/context';
import { acceptChartOfAccountsNotifications } from 'accounting/services';
import { ChartOfAccountsUpdateBar } from 'accounting/components/ChartOfAccountsUpdateBar';
import { Drawer } from '_common/components/Drawer';
import { useUpdateNotifications } from 'accounting/stores/updateNotifications';
import { ChartOfAccountsUpdateText } from 'accounting/components/ChartOfAccountsUpdateText';
import { Button } from '_common/components/Button';

import css from './AccountingTabs.css';

enum Tabs {
  transactions = 'transactions',
  settings = 'settings',
  log = 'log',
}

export function AccountingTabs() {
  const messages = useMessages();
  const [params] = useSearchParams();
  const [tab, setTab] = usePageTabs<Tabs>(Tabs.transactions);

  const { business } = useBusiness();
  const [selectedTransactions, setSelectedTransactions] = createSignal<string[]>([]);
  const [viewingUpdateDetailsDrawer, setViewingUpdateDetailsDrawer] = createSignal(false);
  const updateNotifications = useUpdateNotifications();

  const onSelectTransaction = (id: string) => {
    if (!selectedTransactions().includes(id)) {
      setSelectedTransactions([...selectedTransactions(), id]);
    }
  };

  const onDismissNotifications = () => {
    acceptChartOfAccountsNotifications();
    updateNotifications.setData([]);
    setViewingUpdateDetailsDrawer(false);
  };

  const onDeselectTransaction = (id: string) => {
    const newSelectedTransactions = selectedTransactions();
    setSelectedTransactions(newSelectedTransactions.filter((transactionId) => transactionId !== id));
  };

  const navigate = useNavigate();

  onMount(async () => {
    if (business().accountingSetupStep !== AccountSetupStep.COMPLETE) {
      navigate('/accounting-setup');
    }
    if (params.notification === 'setup') {
      messages.success({ title: 'Settings update complete', message: 'Ready to sync transactions.' });
    }
  });

  const initPeriod = AccountingTimePeriod.year; // TODO: revise period as necessary
  const PERIOD = dateRangeToISO(getAccountingTimePeriod(initPeriod));

  const activityStore = useActivity({
    params: {
      ...extendPageSize(ACCOUNTING_TRANSACTIONS_PARAMS, storage.get(ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
      ...PERIOD,
      statuses: ['APPROVED'],
    },
  });

  return (
    <div>
      <Show when={updateNotifications.data && updateNotifications.data.length > 0}>
        <ChartOfAccountsUpdateBar
          count={updateNotifications.data ? updateNotifications.data.length : 0}
          setViewingDetailsDrawer={(open: boolean) => {
            setViewingUpdateDetailsDrawer(open);
          }}
          onDismiss={onDismissNotifications}
        />
      </Show>
      <Page title={<Text message="Accounting" />}>
        <TabList value={tab()} onChange={setTab}>
          <Tab value={Tabs.transactions}>
            <Text message="Sync Transactions" />
          </Tab>
          <Tab value={Tabs.log}>
            <Text message="Audit Log" />
          </Tab>
          <Tab value={Tabs.settings}>
            <Text message="Settings" />
          </Tab>
        </TabList>
        <Data
          data={activityStore.data}
          loading={activityStore.loading}
          error={activityStore.error}
          onReload={activityStore.reload}
        >
          <Switch>
            <Match when={tab() === Tabs.transactions}>
              <AccountingOverview
                loading={activityStore.loading}
                error={activityStore.error}
                params={activityStore.params}
                data={activityStore.data}
                onReload={activityStore.reload}
                onChangeParams={onPageSizeChange(activityStore.setParams, (size) =>
                  storage.set(ACTIVITY_PAGE_SIZE_STORAGE_KEY, size),
                )}
                onUpdateData={activityStore.setData}
                selectedTransactions={selectedTransactions}
                onSelectTransaction={onSelectTransaction}
                onDeselectTransaction={onDeselectTransaction}
              />
            </Match>
            <Match when={tab() === Tabs.log}>
              <SyncLog />
            </Match>
            <Match when={tab() === Tabs.settings}>
              <AccountingSettings data={activityStore.data} />
            </Match>
          </Switch>
          <Drawer
            open={viewingUpdateDetailsDrawer()}
            title={<Text message={'Accounts Updates'} />}
            onClose={() => {
              setViewingUpdateDetailsDrawer(false);
            }}
          >
            <div class={css.notificationContainer}>
              <div>
                {updateNotifications.data &&
                  updateNotifications.data.map((notification) => (
                    <ChartOfAccountsUpdateText notification={notification} />
                  ))}
              </div>
              <div class={css.notificationButton}>
                <Button onClick={onDismissNotifications}>
                  <Text message={'Ok'} />
                </Button>
              </div>
            </div>
          </Drawer>
        </Data>
      </Page>
    </div>
  );
}
