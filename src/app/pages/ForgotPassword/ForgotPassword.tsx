import { Text } from 'solid-i18n';
import { useSearchParams } from 'solid-app-router';

import { Link } from '_common/components/Link';
import { Header } from 'signup/components/Header';
import { PagePreAuth } from 'app/components/PagePreAuth';

import { ForgotPasswordForm } from '../../components/ForgotPasswordForm';
import { forgotPassword } from '../../services/auth';

import css from './ForgotPassword.css';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams<{ email?: string }>();

  return (
    <PagePreAuth>
      <>
        <Header size="small">Forgot Password?</Header>
        <ForgotPasswordForm
          initialEmailValue={searchParams.email}
          onSubmit={(email: string) => forgotPassword({ email })}
        />
        <Link darkMode href="/login" class={css.secondary}>
          <Text message="Log In" />
        </Link>
      </>
    </PagePreAuth>
  );
}
