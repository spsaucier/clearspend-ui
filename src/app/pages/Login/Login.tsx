import { createSignal, onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link, useNavigate } from 'solid-app-router';

import { SignUp } from 'signup';
import { sendAnalyticsEvent, AnalyticsEventType } from 'app/utils/analytics';
import { PagePreAuth } from 'app/components/PagePreAuth/PagePreAuth';

import { LoginForm } from '../../components/LoginForm';
import { login } from '../../services/auth';

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
        <h2>Log in</h2>
        <div style={{ 'margin-bottom': '12px' }}>
          <Text
            message="Don't have an account? <link>Get started here</link>."
            link={(text) => (
              <Link href={`/signup${email() ? `?email=${encodeURIComponent(email())}` : ''}`}>{text}</Link>
            )}
          />
        </div>
        <LoginForm onSubmit={submit} />
        <br />
        <Text
          message="<link>Forgot password?</link>"
          link={(text) => (
            <Link href={`/forgot-password${email() ? `?email=${encodeURIComponent(email())}` : ''}`}>{text}</Link>
          )}
        />
      </>
    </PagePreAuth>
  );
}
