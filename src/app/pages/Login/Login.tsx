import { Text } from 'solid-i18n';
import { Link } from 'solid-app-router';

import { wait } from '_common/utils/wait';
import { Box } from 'signup/components/Box';
import { Header } from 'signup/components/Header';
import { Description } from 'signup/components/Description';
import twLogo from 'app/assets/tw-logo.svg';

import { LoginForm } from '../../components/LoginForm';

import css from './Login.css';

export default function Login() {
  const submit = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    await wait(2000);
    // eslint-disable-next-line no-console
    console.log(data);
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
