import { Box } from 'signup/components/Box';
import { Header } from 'signup/components/Header';

import logo from '../../assets/logo-name.svg';
import { ForgotPasswordForm } from '../../components/ForgotPasswordForm';
import { forgotPassword } from '../../services/auth';

import css from './ForgotPassword.css';

export default function ForgotPassword() {
  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={120} height={34} />
      </header>
      <div class={css.content}>
        <Box>
          <Header>Forgot Password?</Header>
          <ForgotPasswordForm onSubmit={(email: string) => forgotPassword({ email })} />
        </Box>
      </div>
    </section>
  );
}
