import { Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { useScript } from 'solid-use-script';

import { useMediaContext } from '_common/api/media/context';
import { Spin } from '_common/components/Spin';
import { Button } from '_common/components/Button';
import { Section } from 'app/components/Section';

import { VerifyAccount } from '../VerifyAccount';
import { readBusinessID } from '../../storage';
import { getAccounts, getLinkToken } from '../../services/accounts';

import css from './LinkAccount.css';

const PLAID_SCRIPT = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

/* eslint-disable no-console */
export function LinkAccount() {
  const navigate = useNavigate();
  const media = useMediaContext();

  getAccounts(readBusinessID())
    .then(console.log)
    .catch((err: unknown) => console.log({ err }));

  getLinkToken(readBusinessID())
    .then(console.log)
    .catch((err: unknown) => console.log({ err }));

  const [loading, error] = useScript(PLAID_SCRIPT);

  return (
    <Section
      title="Connect your account"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor."
    >
      <Switch
        fallback={
          <div class={css.wrapper}>
            <VerifyAccount class={css.verify} />
            <Button type="primary" wide={media.small} onClick={() => navigate('/onboarding/money')}>
              Next
            </Button>
          </div>
        }
      >
        <Match when={loading()}>
          <Spin />
        </Match>
        <Match when={error()}>Failed to load API.</Match>
      </Switch>
    </Section>
  );
}
