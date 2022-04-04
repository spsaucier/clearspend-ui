import { createSignal, onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { SignUp } from 'signup';
import { Link } from '_common/components/Link';
import { sendAnalyticsEvent, AnalyticsEventType, Events } from 'app/utils/analytics';
import { PagePreAuth } from 'app/components/PagePreAuth';
import { Header } from 'signup/components/Header';
import { Description } from 'signup/components/Description';

import { LoginForm } from '../../components/LoginForm';
import { Reviews } from '../../containers/Reviews';
import { login } from '../../services/auth';
import { onSuccessLogin } from '../../utils/onSuccessLogin';

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
      sendAnalyticsEvent({ type: AnalyticsEventType.AddUserProperties, data: user });
      sendAnalyticsEvent({ name: Events.LOGIN });
    }
    user.changePasswordId
      ? navigate('/set-password', { state: { username, password, changePasswordId: user.changePasswordId } })
      : onSuccessLogin(user, navigate);
  };

  return (
    <PagePreAuth side={<Reviews />}>
      <>
        <Header>
          <Text message="Welcome back" />
        </Header>
        <Description>
          <Text message="Please log in." />
        </Description>
        <LoginForm onSubmit={submit} />
        <br />
        <div class={css.text}>
          <Link darkMode href={`/forgot-password${email() ? `?email=${encodeURIComponent(email())}` : ''}`}>
            <Text message="Forgot password?" />
          </Link>
          <Text
            message="Need an account? <link>Sign up here</link>"
            link={(text) => (
              <Link darkMode href={`/signup${email() ? `?email=${encodeURIComponent(email())}` : ''}`}>
                {text}
              </Link>
            )}
          />
        </div>
      </>
    </PagePreAuth>
  );
}
