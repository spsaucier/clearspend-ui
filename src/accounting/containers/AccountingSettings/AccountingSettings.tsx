import { Text, useI18n } from 'solid-i18n';
import { createSignal } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Section } from 'app/components/Section';
import { setActivityExpenseCategory } from 'app/services/activity';
import { useMessages } from 'app/containers/Messages/context';
import { Button } from '_common/components/Button';
import { Popover } from '_common/components/Popover';
import type { PagedDataAccountActivityResponse } from 'generated/capital';
import { postIntegrationExpenseCategoryMappings, deleteCompanyConnection } from 'accounting/services';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';
import type { IntegrationAccountMapping } from 'accounting/components/ChartOfAccountsTable/types';
import {
  useIntegrationExpenseCategoryMappings,
  useStoredIntegrationExpenseCategories,
} from 'accounting/stores/integrationExpenseCategories';

import css from './AccountingSettings.css';

interface AccountingSettingsProps {
  data: Readonly<PagedDataAccountActivityResponse> | null;
}

export function AccountingSettings(props: AccountingSettingsProps) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const messages = useMessages();
  const [open, setOpen] = createSignal(false);
  const [unlinkingIntegration, setUnlinkingIntegration] = createSignal(false);

  const integrationExpenseCategoryStore = useStoredIntegrationExpenseCategories();
  const integrationExpenseCategoryMappingStore = useIntegrationExpenseCategoryMappings();
  const handleSave = (mappings: Readonly<IntegrationAccountMapping | null>[]) =>
    postIntegrationExpenseCategoryMappings(mappings);

  const transactionData = props.data?.content ?? [];

  const onUnlinkIntegration = async () => {
    setUnlinkingIntegration(true);
    try {
      await Promise.all([
        deleteCompanyConnection(),
        transactionData.map((item) => setActivityExpenseCategory(item.accountActivityId!, null, item.notes || '')),
      ]);
      messages.success({
        title: i18n.t('Success'),
        message: i18n.t('The integration has been successfully unlinked.'),
      });
      setUnlinkingIntegration(false);
      navigate('/');
    } catch (error: unknown) {
      setUnlinkingIntegration(false);
      messages.error({ title: i18n.t('Something went wrong') });
    }
  };

  return (
    <div>
      <Section
        title={<Text message="Chart of Accounts" />}
        // description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
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
          saveOnChange={true}
          showDeleted={false}
        />
      </Section>
      <Section
        title={<Text message="Unlink Account" />}
        // description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
        class={css.section}
      >
        <Popover
          balloon
          open={open()}
          onClickOutside={() => setOpen(false)}
          class={css.popoverRoot}
          content={
            <div>
              {/* <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." /> */}
              <div class={css.popoverButtons}>
                <Button view="ghost" onClick={() => setOpen(false)}>
                  <Text message="Cancel" />
                </Button>
                <Button
                  class={css.popoverUnlink}
                  icon={{ name: 'confirm', pos: 'right' }}
                  disabled={unlinkingIntegration()}
                  loading={unlinkingIntegration()}
                  onClick={onUnlinkIntegration}
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
