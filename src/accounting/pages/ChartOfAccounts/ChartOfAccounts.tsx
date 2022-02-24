import { Text } from 'solid-i18n';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { Data } from 'app/components/Data';
import { useIntegrationExpenseCategories } from 'accounting/stores/integrationExpenseCategories';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';

import css from './ChartOfAccounts.css';

interface ChartOfAccountsProps {
  onNext: () => void;
}

export function ChartOfAccounts(props: Readonly<ChartOfAccountsProps>) {
  const integrationExpenseCategoryStore = useIntegrationExpenseCategories();

  return (
    <Page title={<Text message="Set up your Quickbooks integration" />}>
      <div class={css.header}>
        <h3 class={css.title}>
          <Text message="Chart of accounts" />
        </h3>
        <p class={css.description}>
          <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
        </p>
      </div>
      <Data
        data={integrationExpenseCategoryStore.data}
        loading={integrationExpenseCategoryStore.loading}
        error={integrationExpenseCategoryStore.error}
        onReload={integrationExpenseCategoryStore.reload}
      >
        <ChartOfAccountsData
          loading={integrationExpenseCategoryStore.loading}
          error={integrationExpenseCategoryStore.error}
          data={integrationExpenseCategoryStore.data}
          onReload={integrationExpenseCategoryStore.reload}
        />
      </Data>
      <Button onClick={props.onNext}>
        <Text message="Skip Setup" />
      </Button>
    </Page>
  );
}
