import { Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { Link } from '_common/components/Link';
import { Header } from 'signup/components/Header';
import { ResetPasswordForm } from 'app/components/ResetPasswordForm';
import { PagePreAuth } from 'app/components/PagePreAuth';

import { resetPassword } from '../../services/auth';

import css from './ResetPassword.css';

export default function ResetPassword() {
  const params = useParams<{ token: string }>();
  return (
    <PagePreAuth>
      <>
        <Header size="small">Reset Password</Header>
        <ResetPasswordForm
          onSubmit={(newPassword: string) => resetPassword({ changePasswordId: params.token as string, newPassword })}
        />
        <Link darkMode href="/login" class={css.secondary}>
          <Text message="Log In" />
        </Link>
      </>
    </PagePreAuth>
  );
}
