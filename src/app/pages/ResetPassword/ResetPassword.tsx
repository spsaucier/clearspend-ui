import { Link, useParams } from 'solid-app-router';

import { Header } from 'signup/components/Header';
import { ResetPasswordForm } from 'app/components/ResetPasswordForm';
import { PagePreAuth } from 'app/components/PagePreAuth/PagePreAuth';

import { resetPassword } from '../../services/auth';

import css from './ResetPassword.css';

export default function ResetPassword() {
  const params = useParams<{ token: string }>();
  return (
    <PagePreAuth>
      <>
        <Header>Reset Password</Header>
        <ResetPasswordForm
          onSubmit={(newPassword: string) => resetPassword({ changePasswordId: params.token as string, newPassword })}
        />
        <Link class={css.secondary} href="/login">
          Log In
        </Link>
      </>
    </PagePreAuth>
  );
}
