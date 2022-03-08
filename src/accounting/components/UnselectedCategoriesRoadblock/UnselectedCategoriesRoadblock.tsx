import { Accessor, createMemo, For } from 'solid-js';
import { Text } from 'solid-i18n';
import type { DeepReadonly } from 'solid-js/store';

import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';

import type { IntegrationAccountMapping } from '../ChartOfAccountsTable/types';

import css from './UnselectedCategoriesRoadblock.css';

interface UnselectedCategoriesRoadblockProps {
  unusedCategories: Accessor<(number | undefined)[]>;
  onBack: () => void;
  onSave: (mappings: Readonly<IntegrationAccountMapping | null>[]) => void;
  roadblockRequestParameters?: DeepReadonly<IntegrationAccountMapping | null>[];
}

export function UnselectedCategoriesRoadblock(props: UnselectedCategoriesRoadblockProps) {
  const expenseCategories = useExpenseCategories({ initValue: [] });
  const unusedCategoriesMap = createMemo(
    () =>
      expenseCategories.data?.filter(
        (category) => category.iconRef !== undefined && props.unusedCategories().includes(category.iconRef),
      ),
    [props.unusedCategories],
  );

  const handleSave = async () => {
    if (props.roadblockRequestParameters) {
      await props.onSave(props.roadblockRequestParameters);
    }
  };

  return (
    <Page
      contentClass={css.page}
      title={<Text message={`You have ${unusedCategoriesMap()?.length} unmapped categories`} />}
    >
      <div class={css.root}>
        <div class={css.categoriesWrapper}>
          <div class={css.warningText}>
            <Text message="Syncing with your accounting system will remove these expense categories from your ClearSpend account." />
          </div>
          <div class={css.categories}>
            <For each={unusedCategoriesMap()}>
              {(item) =>
                item.categoryName !== undefined && (
                  <div class={css.expenseCategory}>
                    <Text message={item.categoryName} />
                  </div>
                )
              }
            </For>
          </div>
        </div>
        <div class={css.tableButtons}>
          <Button view="ghost" onClick={props.onBack}>
            <Text message="Back" />
          </Button>
          <Button class={css.done} type="primary" icon={{ name: 'confirm', pos: 'right' }} onClick={handleSave}>
            <Text message="Done" />
          </Button>
        </div>
      </div>
    </Page>
  );
}
