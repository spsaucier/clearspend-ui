import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useNavigate, useParams, Navigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { Data } from 'app/components/Data';
import { useMessages } from 'app/containers/Messages/context';
import { useBusiness } from 'app/containers/Main/context';
import { canManageUsers } from 'allocations/utils/permissions';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import type { FormValues } from '../../components/EditEmployeeForm/types';
import { useResource } from '../../../_common/utils/useResource';
import { getUser, editUser } from '../../services';

export default function EmployeeUpdate() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const { currentUser, permissions, mutate } = useBusiness();
  const [user, status, , , reload] = useResource(getUser, params.id);

  const onEdit = async (data: FormValues) => {
    const userId = user()!.userId;
    const { firstName, lastName, email, phone, ...address } = data;
    const updated = { firstName, lastName, email, phone, address: { ...address, country: 'USA' as 'USA' } };

    await editUser(userId, updated);
    if (userId === currentUser().userId) mutate({ currentUser: { ...currentUser(), ...updated } });

    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The employee has been successfully updated.'),
    });

    navigate(`/employees/view/${userId}?tab=settings`);
  };

  return (
    <Show when={canManageUsers(permissions())} fallback={<Navigate href="/" />}>
      <Page title={<Text message="Edit Employee" />}>
        <Data data={user()} loading={status().loading} error={status().error} onReload={reload}>
          <EditEmployeeForm user={user()!} onSave={onEdit} />
        </Data>
      </Page>
    </Show>
  );
}
