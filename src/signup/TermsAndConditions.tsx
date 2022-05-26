import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import logo from 'app/assets/Tagline_Lockup_White.svg';
import { LinkTextButton } from '_common/components/LinkTextButton/LinkTextButton';
import { acceptToC, logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { events } from '_common/api/events';
import { wrapAction } from '_common/utils/wrapAction';

import { FlatButton } from './components/Button/FlatButton';
import { Description } from './components/Description';
import { Header } from './components/Header/Header';

// eslint-disable-next-line css-modules/no-unused-class
import css from './SignUp.css';
import tocCss from './TermsAndConditions.css';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  const [logoutLoading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  const onLogout = async () => {
    await logoutAction();

    navigate('/');
  };

  const [acceptToCLoading, acceptToCAction] = wrapAction(() => acceptToC());

  const onAcceptToC = async () => {
    await acceptToCAction();

    navigate('/');
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={200} height={70} />
      </header>
      <div class={css.content}>
        <div>
          <Header size="large">
            <Text
              class={tocCss.title as string}
              message="We’ve <span>updated</span> our Terms of Service and Privacy Policy"
            />
          </Header>
          <Description size="large">
            <Text message="Please agree to these updated documents to keep using ClearSpend" />
          </Description>
          <LinkTextButton text="Terms of Service" href="https://www.clearspend.com/terms" />
          <LinkTextButton text="Privacy Policy" href="https://www.clearspend.com/privacy" />
          <FlatButton type="primary" loading={acceptToCLoading()} onClick={onAcceptToC}>
            <Text message="Agree and continue" />
          </FlatButton>
          <br />
          <br />
          <FlatButton loading={logoutLoading()} onClick={onLogout}>
            <Text message="Cancel and logout" />
          </FlatButton>
        </div>
      </div>
    </section>
  );
}
