import { Text } from 'solid-i18n';

import { Page } from 'app/components/Page';
import {
  useIntegrationExpenseCategories,
  useIntegrationExpenseCategoryMappings,
} from 'accounting/stores/integrationExpenseCategories';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';
import type { IntegrationAccountMapping } from 'accounting/components/ChartOfAccountsTable/types';
import { postIntegrationExpenseCategoryMappings } from 'accounting/services';
import { useMessages } from 'app/containers/Messages/context';
import { i18n } from '_common/api/intl';

import css from './ChartOfAccounts.css';

interface ChartOfAccountsProps {
  onNext: () => void;
  onCancel: () => void;
}

export function ChartOfAccounts(props: Readonly<ChartOfAccountsProps>) {
  const messages = useMessages();
  const integrationExpenseCategoryStore = useIntegrationExpenseCategories();
  const integrationExpenseCategoryMappingStore = useIntegrationExpenseCategoryMappings();

  const handleSave = (mappings: Readonly<IntegrationAccountMapping | null>[]) => {
    postIntegrationExpenseCategoryMappings(mappings).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
    props.onNext();
  };

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
      <ChartOfAccountsData
        loading={integrationExpenseCategoryStore.loading || integrationExpenseCategoryMappingStore.loading}
        error={integrationExpenseCategoryStore.error}
        data={integrationExpenseCategoryStore.data}
        mappings={integrationExpenseCategoryMappingStore.data}
        onSave={handleSave}
        onReload={async () => {
          integrationExpenseCategoryStore.reload();
          integrationExpenseCategoryMappingStore.reload();
        }}
        onCancel={props.onCancel}
        onSkip={props.onNext}
      />
    </Page>
  );
}
