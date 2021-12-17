import { Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { useMCC } from 'app/stores/mcc';
import { saveUser } from 'employees/services';
import { useUsersList } from 'employees/stores/usersList';
import type { CreateAllocationRequest, CreateUserRequest } from 'generated/capital';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { saveAllocation } from '../../services';
import { useAllocations } from '../../stores/allocations';

export default function AllocationEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc();

  const mcc = useMCC({ initValue: [] });
  const users = useUsersList({ initValue: [] });
  const allocations = useAllocations({ initValue: [] });

  const onAddEmployee = async (userData: Readonly<CreateUserRequest>) => {
    const resp = await saveUser(userData);
    await users.reload();
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    return resp;
  };

  const onSave = async (allocation: CreateAllocationRequest) => {
    await saveAllocation(allocation);
    messages.success({ title: i18n.t('Changes successfully saved.') });
    navigate(location.state?.prev || '/allocations');
  };

  return (
    <Page title={<Text message="New Allocation" />}>
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
        <Match when={allocations.loading || mcc.loading || users.loading}>
          <Loading />
        </Match>
        <Match when={allocations.data?.length && mcc.data?.length}>
          <EditAllocationForm
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
