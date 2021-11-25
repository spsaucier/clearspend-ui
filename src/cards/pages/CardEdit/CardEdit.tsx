import { Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { useResource } from '_common/utils/useResource';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { getAllocations } from 'allocations/services';
import { getUsers, saveUser } from 'employees/services';

import { EditCardForm } from '../../components/EditCardForm';
import { saveCard } from '../../services';
import type { IssueCard } from '../../types';

export default function CardEdit() {
  const messages = useMessages();
  const navigate = useNavigate();

  const [allocations, aStatus, , , reloadAllocations] = useResource(getAllocations, undefined);
  const [users, uStatus, , , reloadUsers] = useResource(getUsers, undefined);

  const onAddEmployee = async (firstName: string, lastName: string, email: string) => {
    const resp = await saveUser({ firstName, lastName, email });
    await reloadUsers();
    messages.success({
      title: 'Success',
      message: 'The new employee has been successfully added to your organization.',
    });
    return resp;
  };

  const onSave = async (params: Readonly<IssueCard>) => {
    await saveCard(params);
    messages.success({
      title: 'Success',
      message: 'Changes successfully saved.',
    });
    navigate('/'); // '/cards'
  };

  return (
    <Page title="New Card">
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
          <EditCardForm users={users()!} allocations={allocations()!} onAddEmployee={onAddEmployee} onSave={onSave} />
        </Match>
      </Switch>
    </Page>
  );
}
