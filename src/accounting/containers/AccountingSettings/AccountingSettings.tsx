import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { Section } from 'app/components/Section';
import { Button } from '_common/components/Button';
import { Popover } from '_common/components/Popover';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';
import {
  useIntegrationExpenseCategories,
  useIntegrationExpenseCategoryMappings,
} from 'accounting/stores/integrationExpenseCategories';
import { postIntegrationExpenseCategoryMappings } from 'accounting/services';
import type { IntegrationAccountMapping } from 'accounting/components/ChartOfAccountsTable/types';

import css from './AccountingSettings.css';

export function AccountingSettings() {
  const [open, setOpen] = createSignal(false);
  const integrationExpenseCategoryStore = useIntegrationExpenseCategories();
  const integrationExpenseCategoryMappingStore = useIntegrationExpenseCategoryMappings();
  const handleSave = (mappings: Readonly<IntegrationAccountMapping | null>[]) =>
    postIntegrationExpenseCategoryMappings(mappings);

  return (
    <div>
      <Section
        title={<Text message="Chart of Accounts" />}
        description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
        class={css.section}
      >
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
        />
      </Section>
      <Section
        title={<Text message="Unlink Account" />}
        description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
        class={css.section}
      >
        <Popover
          balloon
          open={open()}
          onClickOutside={() => setOpen(false)}
          class={css.popoverRoot}
          content={
            <div>
              <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
              <div class={css.popoverButtons}>
                <Button view="ghost" onClick={() => setOpen(false)}>
                  <Text message="Cancel" />
                </Button>
                <Button
                  class={css.popoverUnlink}
                  icon={{ name: 'confirm', pos: 'right' }}
                  onClick={() => {
                    // TODO
                  }}
                >
                  <Text message="Unlink now" />
                </Button>
              </div>
            </div>
          }
        >
          <Button size="lg" icon="trash" class={css.unlink} onClick={() => setOpen(true)}>
            <Text message="Unlink account" />
          </Button>
        </Popover>
      </Section>
    </div>
  );
}
