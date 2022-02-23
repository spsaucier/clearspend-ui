import { Link, useSearchParams } from 'solid-app-router';

import { Header } from 'signup/components/Header';
import { PagePreAuth } from 'app/components/PagePreAuth/PagePreAuth';

import { ForgotPasswordForm } from '../../components/ForgotPasswordForm';
import { forgotPassword } from '../../services/auth';

import css from './ForgotPassword.css';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams<{ email?: string }>();
  return (
    <PagePreAuth>
      <>
        <Header size="small">Forgot Password?</Header>
        <div style={{ height: `32px` }} />
        <ForgotPasswordForm
          initialEmailValue={searchParams.email}
          onSubmit={(email: string) => forgotPassword({ email })}
        />
        <Link class={css.secondary} href="/login">
          Log In
        </Link>
      </>
    </PagePreAuth>
  );
}
