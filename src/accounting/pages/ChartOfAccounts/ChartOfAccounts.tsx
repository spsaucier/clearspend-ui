import { Text } from 'solid-i18n';
import { Navigate, useNavigate } from 'solid-app-router';
import { createSignal, Show } from 'solid-js';

import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';
import { postIntegrationExpenseCategoryMappings } from 'accounting/services';
import { useRecentUpdateNotifications } from 'accounting/stores/updateNotifications';
import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';
import type { AddChartOfAccountsMappingRequest } from 'generated/capital';
import { i18n } from '_common/api/intl';
import { canManageConnections } from 'allocations/utils/permissions';
import { useBusiness } from 'app/containers/Main/context';
import { Button } from '_common/components/Button';

import css from './ChartOfAccounts.css';

export function ChartOfAccounts() {
  const { permissions } = useBusiness();

  const updateNotifications = useRecentUpdateNotifications();
  const messages = useMessages();
  const navigate = useNavigate();

  const [updateRequest, setUpdateRequest] = createSignal<Readonly<AddChartOfAccountsMappingRequest[]>>([]);

  const onUpdate = (mappingRequest: readonly Readonly<AddChartOfAccountsMappingRequest>[]) => {
    setUpdateRequest(mappingRequest);
  };

  const onSave = () => {
    if (updateRequest().length > 0) {
      postIntegrationExpenseCategoryMappings(updateRequest()).catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
    }
    navigate('/accounting?tab=settings');
  };

  return (
    <Show when={canManageConnections(permissions())} fallback={<Navigate href="/" />}>
      <Page contentClass={css.pageContent} title={<Text message="Manage chart of accounts" />}>
        <ChartOfAccountsData saveOnChange showUpdateButton newCategories={updateNotifications.data} onSave={onUpdate} />
        <div class={css.tableButtons}>
          <Button
            onClick={() => {
              navigate('/accounting?tab=settings');
            }}
          >
            <Text message="Cancel" />
          </Button>
          <Button class={css.done} type="primary" icon={{ name: 'confirm', pos: 'right' }} onClick={onSave}>
            <Text message="Save changes" />
          </Button>
        </div>
      </Page>
    </Show>
  );
}
