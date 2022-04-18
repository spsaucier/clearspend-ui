import { useI18n, Text } from 'solid-i18n';
import { useLocation, useNavigate } from 'solid-app-router';

import { login, changePasswordById } from 'app/services/auth';
import { PagePreAuth } from 'app/components/PagePreAuth';
import { useMessages } from 'app/containers/Messages/context';
import { onSuccessLogin } from 'app/utils/onSuccessLogin';
import { PasswordForm } from 'signup/components/PasswordForm';

interface LocationState {
  username: string;
  password: string;
  changePasswordId: string;
  returnUrl?: string;
}

export default function SetPassword() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const { state } = useLocation<LocationState>();
  if (!state?.username || !state.password || !state.changePasswordId) navigate('/');

  const onPasswordUpdate = async (newPassword: string) => {
    const { username, password, changePasswordId } = state as LocationState;
    await changePasswordById(changePasswordId, { username, currentPassword: password, newPassword });
    const user = await login(username, newPassword);
    onSuccessLogin({ user, navigate, overridePath: state?.returnUrl });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The password has been successfully updated.'),
    });
  };

  return (
    <PagePreAuth>
      <PasswordForm agreement submitText={<Text message="Set Password" />} onPasswordUpdate={onPasswordUpdate} />
    </PagePreAuth>
  );
}
