import { Text } from 'solid-i18n';
import { createSignal, Match, Switch, batch } from 'solid-js';

import { Page } from 'app/components/Page';
import { postIntegrationExpenseCategoryMappings, updateChartOfAccounts } from 'accounting/services';
import { useMessages } from 'app/containers/Messages/context';
import { i18n } from '_common/api/intl';
import { UnselectedCategoriesRoadblock } from 'accounting/components/UnselectedCategoriesRoadblock';
import type { AddChartOfAccountsMappingRequest } from 'generated/capital';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';

import css from './ChartOfAccounts.css';

interface ChartOfAccountsProps {
  onNext: () => void;
  onCancel: () => void;
}

export function ChartOfAccounts(props: Readonly<ChartOfAccountsProps>) {
  const messages = useMessages();

  const [showRoadblock, setShowRoadblock] = createSignal(false);
  const [unselectedCategories, setUnselectedCategories] = createSignal<readonly string[]>([]);
  const [roadblockRequestParameters, setRoadblockRequestParameters] =
    createSignal<readonly Readonly<AddChartOfAccountsMappingRequest>[]>();

  const handleSave = (mappings: readonly Readonly<AddChartOfAccountsMappingRequest>[]) => {
    postIntegrationExpenseCategoryMappings(mappings)
      .then(() => updateChartOfAccounts())
      .then(() => props.onNext())
      .catch(() => messages.error({ title: i18n.t('Something went wrong') }));
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
        <Page title={<Text message="Set up your QuickBooks Online integration" />}>
          <div class={css.header}>
            <h3 class={css.title}>
              <Text message="Chart of accounts" />
            </h3>
            <p class={css.description}>
              {/* <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." /> */}
            </p>
          </div>
          <ChartOfAccountsData
            onSave={handleSave}
            onSetRoadblock={(mappings, unmappedIds) => {
              batch(() => {
                setShowRoadblock(true);
                setUnselectedCategories(unmappedIds);
                setRoadblockRequestParameters(mappings);
              });
            }}
            onCancel={props.onCancel}
          />
        </Page>
      </Match>
    </Switch>
  );
}
