import { Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { useResource } from '_common/utils/useResource';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { getAllocations } from 'allocations/services';
import { getUsers, saveUser } from 'employees/services';
import type { UUIDString } from 'app/types/common';
import type { CreateUser } from 'employees/types';

import { EditCardForm } from '../../components/EditCardForm';
import { saveCard } from '../../services';
import type { IssueCard } from '../../types';

export default function CardEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc<{ userId: UUIDString; allocationId: UUIDString }>();

  const [allocations, aStatus, , , reloadAllocations] = useResource(getAllocations, undefined);
  const [users, uStatus, , , reloadUsers] = useResource(getUsers, undefined);

  const onAddEmployee = async (userData: Readonly<CreateUser>) => {
    const resp = await saveUser(userData);
    await reloadUsers();
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    return resp;
  };

  const onSave = async (data: Readonly<IssueCard>) => {
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
        <Match when={aStatus().error}>
          <LoadingError onReload={reloadAllocations} />
        </Match>
        <Match when={uStatus().error}>
          <LoadingError onReload={reloadUsers} />
        </Match>
        <Match when={(aStatus().loading && !allocations()) || (uStatus().loading && !users())}>
          <Loading />
        </Match>
        <Match when={allocations() && users()}>
          <EditCardForm
            userId={location.state?.userId}
            allocationId={location.state?.allocationId}
            users={users()!}
            allocations={allocations()!}
            onAddEmployee={onAddEmployee}
            onSave={onSave}
          />
        </Match>
      </Switch>
    </Page>
  );
}
