import { Text } from 'solid-i18n';
import { createSignal, Match, Switch } from 'solid-js';
import type { DeepReadonly } from 'solid-js/store';

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
import { UnselectedCategoriesRoadblock } from 'accounting/components/UnselectedCategoriesRoadblock/UnselectedCategoriesRoadblock';

import css from './ChartOfAccounts.css';

interface ChartOfAccountsProps {
  onNext: () => void;
  onCancel: () => void;
}

export function ChartOfAccounts(props: Readonly<ChartOfAccountsProps>) {
  const messages = useMessages();
  const integrationExpenseCategoryStore = useIntegrationExpenseCategories();
  const integrationExpenseCategoryMappingStore = useIntegrationExpenseCategoryMappings();
  const [showRoadblock, setShowRoadblock] = createSignal(false);
  const [unselectedCategories, setUnselectedCategories] = createSignal<(string | undefined)[]>([]);
  const [roadblockRequestParameters, setRoadblockRequestParameters] =
    createSignal<DeepReadonly<IntegrationAccountMapping | null>[]>();
  const handleSave = (mappings: Readonly<IntegrationAccountMapping | null>[]) => {
    postIntegrationExpenseCategoryMappings(mappings).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
    props.onNext();
  };

  return (
    <Switch>
      <Match when={showRoadblock()}>
        <UnselectedCategoriesRoadblock
          unusedCategories={unselectedCategories}
          onSave={handleSave}
          roadblockRequestParameters={roadblockRequestParameters()}
          onBack={() => setShowRoadblock(false)}
        />
      </Match>
      <Match when={!showRoadblock()}>
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
            setShowRoadblock={setShowRoadblock}
            setUnselectedCategories={setUnselectedCategories}
            setRoadblockRequestParameters={setRoadblockRequestParameters}
          />
        </Page>
      </Match>
    </Switch>
  );
}
