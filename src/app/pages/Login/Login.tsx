import { onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { Link, useNavigate } from 'solid-app-router';

import { Box } from 'signup/components/Box';
import { Header } from 'signup/components/Header';
import { Description } from 'signup/components/Description';
import { SignUp } from 'signup';
import twLogo from 'app/assets/tw-logo.svg';

import { LoginForm } from '../../components/LoginForm';
import { ownerStore } from '../../stores/owner';

import css from './Login.css';

export default function Login() {
  const navigate = useNavigate();

  onMount(() => SignUp.preload());

  const submit = async (username: string, password: string) => {
    await ownerStore.login(username, password);
    navigate('/');
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={twLogo} alt="Company logo" width={123} height={24} />
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
