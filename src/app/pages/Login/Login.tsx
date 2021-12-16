import { onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link, useNavigate } from 'solid-app-router';

import { Box } from 'signup/components/Box';
import { Header } from 'signup/components/Header';
import { Description } from 'signup/components/Description';
import { SignUp } from 'signup';
import { sendAnalyticsEvent, AnalyticsEventType } from 'app/utils/analytics';

import logo from '../../assets/logo-name.svg';
import { LoginForm } from '../../components/LoginForm';
import { login } from '../../services/auth';

import css from './Login.css';

export default function Login() {
  const navigate = useNavigate();

  onMount(() => SignUp.preload());

  const submit = async (username: string, password: string) => {
    const user = await login(username, password);
    if (user.userId) {
      sendAnalyticsEvent({ type: AnalyticsEventType.Identify, name: user.userId });
      navigate('/');
    }
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={120} height={34} />
      </header>
      <div class={css.content}>
        <Box>
          <Header>Log in</Header>
          <Description>
            <Text
              message="Don't have an account? <link>Get started here</link>."
              link={(text) => <Link href="/signup">{text}</Link>}
            />
          </Description>
          <LoginForm onSubmit={submit} />
        </Box>
      </div>
    </section>
  );
}
