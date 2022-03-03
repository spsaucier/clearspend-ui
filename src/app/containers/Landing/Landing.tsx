import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { getBankAccounts, linkBankAccounts, registerBankAccount } from 'onboarding/services/accounts';
import { useNav } from '_common/api/router';
import { Button } from '_common/components/Button';
import { useResource } from '_common/utils/useResource';
import { InternalBankAccount } from 'onboarding/components/InternalBankAccount';
import { LinkAccountButton } from 'onboarding/containers/LinkAccount/LinkAccountButton';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import css from './Landing.css';

interface LandingProps {
  addBalance?: boolean;
}

export function Landing(props: LandingProps) {
  const navigate = useNav();
  const [accounts] = useResource(getBankAccounts);

  return (
    <div class={css.root}>
      <Show when={props.addBalance}>
        <div class={css.card}>
          <h3 class={css.cardTitle}>
            <Text message="Add Balance" />
          </h3>
          <p class={css.cardMessage}>
            <Text message="You'll need to add funds to at least one allocation before you can issue cards." />
          </p>
          <p class={css.cardMessage}>
            <Text message="You can deposit funds via a linked bank account, or via ACH or wire transfer to a virtual account ClearSpend has created for you. If you just finished setting up your account, your virtual account will be available in about 30 minutes." />
          </p>
          <InternalBankAccount
            numberLinesOnly
            class={css.internalBankAccount}
            fallbackText={
              <Text message="We are working quickly setting your account up. Please allow 30 min for some features like wire transfers to become available. You will receive an email notification when your account is ready." />
            }
          />
          <Show when={accounts.length === 0}>
            <LinkAccountButton
              onSuccess={async (token, accountName) => {
                const bankAccounts = await linkBankAccounts(token);
                const matchedAccounts = accountName
                  ? bankAccounts.filter((account) => account.name === accountName && account.businessBankAccountId)
                  : bankAccounts.filter((account) => account.businessBankAccountId);
                await Promise.all(matchedAccounts.map((account) => registerBankAccount(account.businessBankAccountId)));
                sendAnalyticsEvent({ name: Events.LINK_BANK });
                location.reload();
              }}
            />
          </Show>
        </div>
      </Show>

      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Onboard your employees" />
        </h3>
        <p class={css.cardMessage}>
          <Text message="Give employees access! Create and manage your team member accounts here." />
        </p>
        <Button size="lg" icon="user" class={css.cardAction} onClick={() => navigate('/employees/edit')}>
          <Text message="Onboard your employees" />
        </Button>
      </div>

      <Show when={!props.addBalance}>
        <div class={css.card}>
          <h3 class={css.cardTitle}>
            <Text message="Set up allocations" />
          </h3>
          <p class={css.cardMessage}>
            <Text message="Create and fund budgets for specific business purposes." />
          </p>
          <Button size="lg" icon="amount" class={css.cardAction} onClick={() => navigate('/allocations/edit')}>
            <Text message="Create allocation" />
          </Button>
        </div>
      </Show>

      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Issue your first card" />
        </h3>
        <p class={css.cardMessage}>
          <Text message="It’s time to set up your first ClearSpend card." />
        </p>
        <Button size="lg" icon="card-add-new" class={css.cardAction} onClick={() => navigate('/cards/edit')}>
          <Text message="Issue a card" />
        </Button>
      </div>
    </div>
  );
}
