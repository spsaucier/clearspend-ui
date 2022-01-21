import { Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { useMCC } from 'app/stores/mcc';
import { useAllocations } from 'allocations/stores/allocations';
import { saveUser } from 'employees/services';
import { useUsersList } from 'employees/stores/usersList';
import type { CreateUserRequest, IssueCardRequest } from 'generated/capital';

import { EditCardForm } from '../../components/EditCardForm';
import { saveCard } from '../../services';

export default function CardEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc<{ userId: string; allocationId: string }>();

  const mcc = useMCC({ initValue: [] });
  const allocations = useAllocations({ initValue: [] });
  const users = useUsersList({ initValue: [] });

  const onAddEmployee = async (userData: Readonly<CreateUserRequest>) => {
    const resp = await saveUser(userData);
    await users.reload();
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    return resp;
  };

  const onSave = async (data: Readonly<IssueCardRequest>) => {
    await saveCard(data);
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('Changes successfully saved.'),
    });
    navigate(location.state?.prev || '/cards');
  };

  return (
    <Page title={<Text message="New Card" />}>
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={mcc.error}>
          <LoadingError onReload={mcc.reload} />
        </Match>
        <Match when={users.error}>
          <LoadingError onReload={users.reload} />
        </Match>
        <Match when={allocations.loading || (users.loading && !users.data?.length) || mcc.loading}>
          <Loading />
        </Match>
        <Match when={allocations.data?.length && mcc.data?.length}>
          <EditCardForm
            userId={location.state?.userId}
            allocationId={location.state?.allocationId}
            users={users.data!}
            mccCategories={mcc.data!}
            allocations={allocations.data!}
            onAddEmployee={onAddEmployee}
            onSave={onSave}
          />
        </Match>
      </Switch>
    </Page>
  );
}
