import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { useResource } from '_common/utils/useResource';
import { Page } from 'app/components/Page';
import { Data } from 'app/components/Data';
import { useMessages } from 'app/containers/Messages/context';
import { useBusiness } from 'app/containers/Main/context';
import type { CreateUserRequest } from 'generated/capital';

import { EditProfileForm } from '../../components/EditProfileForm';
import { getUser, editUser } from '../../services';

export default function ProfileSettings() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const { signupUser } = useBusiness();
  const [user, status, , , reload] = useResource(getUser, signupUser().userId);

  const onUpdate = async (params: Readonly<CreateUserRequest>) => {
    await editUser(signupUser().userId, params);
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The address has been successfully updated.'),
    });
    navigate('/profile');
  };

  return (
    <Page title={<Text message="Profile" />}>
      <Data data={user()} loading={status().loading} error={status().error} onReload={reload}>
        <EditProfileForm user={user()!} onUpdate={onUpdate} />
      </Data>
    </Page>
  );
}
