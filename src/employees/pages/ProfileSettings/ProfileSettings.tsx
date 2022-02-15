import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';
import { useBusiness } from 'app/containers/Main/context';
import type { CreateUserRequest } from 'generated/capital';

import { EditProfileForm } from '../../components/EditProfileForm';
import { editUser } from '../../services';

export default function ProfileSettings() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const { loggedInUser } = useBusiness();

  const onUpdate = async (params: Readonly<CreateUserRequest>) => {
    await editUser(loggedInUser().userId, params);
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The address has been successfully updated.'),
    });
    navigate('/profile');
  };

  return (
    <Page title={<Text message="Profile" />}>
      <EditProfileForm user={loggedInUser()!} onUpdate={onUpdate} />
    </Page>
  );
}
