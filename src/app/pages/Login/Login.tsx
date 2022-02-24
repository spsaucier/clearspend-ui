import { createSignal, onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link, useNavigate } from 'solid-app-router';

import { SignUp } from 'signup';
import { sendAnalyticsEvent, AnalyticsEventType } from 'app/utils/analytics';
import { PagePreAuth } from 'app/components/PagePreAuth/PagePreAuth';
import { Header } from 'signup/components/Header';
import { Description } from 'signup/components/Description';

import { LoginForm } from '../../components/LoginForm';
import { login } from '../../services/auth';

import css from './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');

  onMount(() => SignUp.preload());

  const submit = async (username: string, password: string) => {
    setEmail(username);
    const user = await login(username, password);
    if (user.userId) {
      sendAnalyticsEvent({ type: AnalyticsEventType.Identify, name: user.userId });
      navigate('/');
    }
  };

  return (
    <PagePreAuth>
      <>
        <Header>Welcome back</Header>
        <Description>
          <Text message="Please log in." />
        </Description>
        <LoginForm onSubmit={submit} />
        <br />
        <div class={css.text}>
          <Text
            message="<link>Forgot password?</link>"
            link={(text) => (
              <Link href={`/forgot-password${email() ? `?email=${encodeURIComponent(email())}` : ''}`}>{text}</Link>
            )}
          />
          <Text
            message="Need an account? <link>Sign up here</link>"
            link={(text) => (
              <Link href={`/signup${email() ? `?email=${encodeURIComponent(email())}` : ''}`}>{text}</Link>
            )}
          />
        </div>
      </>
    </PagePreAuth>
  );
}
